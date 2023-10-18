package main

import (
	"context"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
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
	// Utility
	e.GET("/status", getStatus)
	e.POST("/auth/google", postAuthGoogle)

	// Message Apis
	e.GET("/channels", getChannels)
	e.POST("/channels", postChannels)
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

	secret := getJwtSecretBytes()

	e.Use(echojwt.WithConfig(echojwt.Config{
		SigningKey: secret,
		Skipper: func(c echo.Context) bool {
			if c.Path() == "/status" || c.Path() == "/auth/google" {
				return true
			}
			return false
		},
	}))
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

	_, err = db.Exec(`INSERT INTO Users (userId,username,picture) VALUES (?,?,?)`, 12, "Test Account", "https://picsum.photos/200")
	if err != nil {
		fmt.Println(err)
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

func exchangeTokenWithGoogle(u *OAuth) (*GoogleJwt, error) {
	tok, err := config.Exchange(context.Background(), u.Code)
	if err != nil {
		return nil, err
	}

	client := config.Client(context.Background(), tok)
	idToken := tok.Extra("id_token").(string)

	resp, err := client.Get("https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken)
	if err != nil {
		return nil, err
	}

	bytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	idTokenResp := new(GoogleJwt)
	json.Unmarshal(bytes, idTokenResp)

	return idTokenResp, nil
}

func log(value any) {
	fmt.Println(time.Now(), value)
}
