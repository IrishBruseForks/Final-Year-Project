package main

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/go-playground/validator"
	_ "github.com/go-sql-driver/mysql"
	jwt "github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	echo "github.com/labstack/echo/v4"
	middleware "github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
	oauth2 "golang.org/x/oauth2"
	googleOauth "golang.org/x/oauth2/google"
)

var InfoLog *log.Logger

var config *oauth2.Config
var db *sql.DB
var useSSL bool = false

type CustomValidator struct {
	validator *validator.Validate
}

func main() {
	e := echo.New()
	e.HideBanner = true
	e.Validator = &CustomValidator{validator: validator.New()}
	log.SetHeader("${short_file}:${line}")
	log.EnableColor()
	loadEnv()

	defer db.Close()
	initDatabase()

	initOauth()

	addMiddleware(e)
	addRoutes(e)

	host, found := os.LookupEnv("Host")
	if !found {
		panic("Host missing in .env")
	}

	if useSSL {
		e.Logger.Fatal(e.StartTLS(host, "./certs/certificate.crt", "./certs/private.key"))
		e.Close()
	} else {
		e.Logger.Fatal(e.Start(host))
		e.Close()
	}
}

func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.validator.Struct(i); err != nil {
		// Optionally, you could return the error to give each route more control over the status code
		return err
	}
	return nil
}

func addRoutes(e *echo.Echo) {

	// Non-Auth Apis
	e.GET("/", getRoot)
	e.GET("/status", getStatus)
	e.POST("/auth/google", postAuthGoogle)

	// Validate login
	e.GET("/login", getLogin)

	// Channel Endpoints
	e.GET("/channels", getChannels)
	e.POST("/channels", postChannels)
	e.PUT("/channels", putChannels)

	e.GET("/replies", getReplies)

	e.GET("/channel", getChannel)

	// Messages Endpoints
	e.GET("/messages", getMessages)
	e.POST("/messages", postMessages)

	// Friends Endpoints
	e.GET("/friends", getFriends)
}

func addMiddleware(e *echo.Echo) {
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format:  "${remote_ip} ${method} ${status} ${error} ${uri}\n",
		Skipper: Skipper,
	}))

	if useSSL {
		e.Use(middleware.HTTPSRedirect())
	}

	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Auth Apis
	secret := getJwtSecretBytes()

	jwtMiddleware := echojwt.WithConfig(echojwt.Config{
		SigningKey: secret,
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(AuthJwt)
		},
		Skipper: func(c echo.Context) bool {
			return c.Path() == "/" || c.Path() == "/status" || c.Path() == "/auth/google"
		},
	})
	e.Use(jwtMiddleware)
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

func initDatabase() {
	sqlUrl, found := os.LookupEnv("SqlUrl")
	if !found {
		panic("SqlUrl missing in .env")
	}

	var err error
	db, err = sql.Open("mysql", sqlUrl)
	if err != nil {
		panic(err)
	}

	db.Exec("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci';")
}

func Skipper(c echo.Context) bool {
	return c.Request().Method == "OPTIONS"
}
