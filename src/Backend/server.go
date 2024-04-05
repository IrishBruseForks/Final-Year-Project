package main

import (
	"database/sql"
	"os"
	"strings"

	"github.com/go-playground/validator"
	_ "github.com/go-sql-driver/mysql"
	jwt "github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
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

type CustomValidator struct {
	validator *validator.Validate
}

func main() {
	e := echo.New()
	e.HideBanner = true
	e.Validator = &CustomValidator{validator: validator.New()}
	log.SetHeader("${short_file}:${line}")
	log.EnableColor()
	log.SetLevel(log.DEBUG)
	_ = godotenv.Load()

	defer db.Close()
	initDatabase()

	initOauth()

	addMiddleware(e)
	addRoutes(e)

	port, found := os.LookupEnv("PORT")
	if !found {
		panic("PORT missing in env variables")
	}

	e.Logger.Fatal(e.Start(":" + port))
	e.Close()
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
	e.POST("/auth/google", postLogin)

	e.POST("/signup", postSignup)
	e.GET("/profile", getProfile)
	e.PUT("/profile", putProfile)

	// User
	e.GET("/user", getUser)

	// Channel Endpoints
	e.GET("/channels", getChannels)
	e.POST("/channels", postChannels)
	e.PUT("/channels", putChannels)
	e.DELETE("/channels", deleteChannels)
	e.GET("/channel", getChannel)

	e.GET("/replies", getReplies)

	// Messages Endpoints
	e.GET("/messages", getMessages)
	e.POST("/messages", postMessages)
	e.DELETE("/messages", deleteMessage)

	// Friends Endpoints
	e.GET("/friend", getFriend)
	e.GET("/friends", getFriends)
	e.POST("/friends", postFriends)
}

func addMiddleware(e *echo.Echo) {
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "${remote_ip} ${method} ${status} ${error} ${uri}\n",
		Skipper: func(c echo.Context) bool {
			return c.Request().Method == "OPTIONS" || c.Path() == "/channels" || strings.HasPrefix(c.Path(), "/messages")
		},
	}))

	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Auth Apis
	secret := getJwtSecretBytes()

	jwtMiddleware := echojwt.WithConfig(echojwt.Config{
		SigningKey: secret,
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			if c.Path() == "/signup" {
				return new(SignupJwt)
			}

			return new(AuthJwt)
		},
		Skipper: func(c echo.Context) bool {
			return c.Path() == "/" || c.Path() == "/status" || c.Path() == "/auth/google"
		},
	})
	e.Use(jwtMiddleware)
}

func initOauth() {
	id, found := os.LookupEnv("GOOGLE_ID")
	if !found {
		panic("GOOGLE_ID missing in env variables")
	}

	secret, found := os.LookupEnv("GOOGLE_SECRET")
	if !found {
		panic("GOOGLE_SECRET missing in env variables")
	}

	config = &oauth2.Config{
		ClientID:     id,
		ClientSecret: secret,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		RedirectURL: "postmessage",
		Endpoint:    googleOauth.Endpoint,
	}
}

func initDatabase() {
	var err error

	url, found := os.LookupEnv("SQL_URL")
	if !found {
		panic("SQL_URL missing in env variables")
	}

	db, err = sql.Open("mysql", url)
	if err != nil {
		log.Error(err)
	}

	err = db.Ping()
	if err != nil {
		log.Error(err)
	}

	db.Exec("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci';")
}
