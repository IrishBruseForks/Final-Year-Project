package main

import (
	"database/sql"
	"encoding/base64"
	"fmt"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"

	jwt "github.com/golang-jwt/jwt/v5"
	godotenv "github.com/joho/godotenv"
	echojwt "github.com/labstack/echo-jwt/v4"
	echo "github.com/labstack/echo/v4"
	middleware "github.com/labstack/echo/v4/middleware"
	oauth2 "golang.org/x/oauth2"
	googleOauth "golang.org/x/oauth2/google"
)

var config *oauth2.Config
var db *sql.DB

func main() {
	loadEnv()

	initDatabase()
	initOauth()
	defer db.Close()

	runEchoServer()
}

func runEchoServer() {
	// Clear console output for debugging
	fmt.Print("\033[H\033[2J")

	e := echo.New()
	e.HideBanner = true

	addMiddleware(e)
	addRoutes(e)
	e.Logger.Fatal(e.Start("localhost:1323"))
	e.Close()
}

func addRoutes(e *echo.Echo) {
	// Non-Auth Apis
	e.GET("/status", getStatus)
	e.POST("/auth/google", postAuthGoogle)

	// Auth Apis
	secret := getJwtSecretBytes()

	jwtMiddleware := echojwt.WithConfig(echojwt.Config{
		SigningKey: secret,
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(AuthJwt)
		},
		Skipper: func(c echo.Context) bool {
			return c.Path() == "/status" || c.Path() == "/auth/google"
		},
	})

	e.Use(jwtMiddleware)

	// Validate login
	e.GET("/login", getLogin)

	// Channel Apis
	e.GET("/channels", getChannels)
	e.POST("/channels", postChannels)
	e.PUT("/channels", putChannels)

	// Messages Apis
	e.GET("/messages", getChannels)
	e.POST("/messages", postChannels)
}

func addMiddleware(e *echo.Echo) {
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "${method} ${status} ${uri} ${error}\n",
	}))

	e.Use(middleware.BodyDump(func(c echo.Context, reqBody, resBody []byte) {
		fmt.Println("Request: ", string(reqBody))
		fmt.Println("Response:", string(resBody))
	}))

	e.Use(middleware.CORS())
	e.Logger.SetLevel(0)

}

func initOauth() {
	clientID, found := os.LookupEnv("ClientID")
	if !found {
		panic("ClientID missing in .env")
	}

	clientSecret, found := os.LookupEnv("ClientSecret")
	if !found {
		panic("ClientSecret missing in .env")
	}

	config = &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		RedirectURL: "postmessage",
		Endpoint:    googleOauth.Endpoint,
	}
}

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
}

func initDatabase() {
	var err error
	db, err = sql.Open("mysql", os.Getenv("SqlUrl"))
	if err != nil {
		panic(err)
	}
}

type GoogleJwt struct {
	Subject              string `json:"sub"`
	Name                 string `json:"name"`
	Picture              string `json:"picture"`
	jwt.RegisteredClaims `tstype:",extends"`
}

func getJwtSecretBytes() []byte {
	jwtSecret, found := os.LookupEnv("JwtSecret")
	if !found {
		panic(".env missing JwtSecret")
	}

	secretBytes, err := base64.StdEncoding.DecodeString(jwtSecret)
	if err != nil {
		panic(err)
	}

	return secretBytes
}

func log(value error) {
	fmt.Println(time.Now(), value.Error())
}

func apiError(prefix string, value error, httpError error) error {
	fmt.Println("Error("+prefix+"):", value.Error())
	return httpError
}
