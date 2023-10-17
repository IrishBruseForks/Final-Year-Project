package main

import (
	"context"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/glebarez/go-sqlite"
	jwt "github.com/golang-jwt/jwt/v5"
	godotenv "github.com/joho/godotenv"
	echo "github.com/labstack/echo/v4"
	middleware "github.com/labstack/echo/v4/middleware"
	oauth2 "golang.org/x/oauth2"
	googleOauth "golang.org/x/oauth2/google"

	echojwt "github.com/labstack/echo-jwt/v4"
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
	e := echo.New()

	addMiddleware(e)
	addRoutes(e)
	e.Logger.Fatal(e.Start("localhost:1323"))
	e.Close()
}

func addRoutes(e *echo.Echo) {
	e.GET("/status", status)
	e.POST("/auth/google", oauthGoogle)
	e.GET("/test", func(c echo.Context) error {
		return c.String(http.StatusOK, "Test")
	})
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
	log.Println(len(secret))

	e.Use(echojwt.WithConfig(echojwt.Config{
		SigningKey: secret,
		Skipper: func(c echo.Context) bool {
			if c.Path() == "/status" || c.Path() == "/auth/google" {
				return true
			}
			return false
		},
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(AuthJwt)
		},
	}))
}

func initOauth() {
	config = &oauth2.Config{
		ClientID:     os.Getenv("ClientID"),
		ClientSecret: os.Getenv("ClientSecret"),
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
		log.Fatal(err)
	}
}

func initDatabase() {
	var err error
	db, err = sql.Open("sqlite", "./database.db")
	if err != nil {
		log.Fatal(err)
	}

	db.Exec(`CREATE TABLE IF NOT EXISTS Users(id int primary key, name text, picture text)`)
}

func status(c echo.Context) error {
	return c.String(http.StatusOK, "Alive")
}

type AuthJwt struct {
	Name                 string `json:"name"`
	Picture              string `json:"picture"`
	jwt.RegisteredClaims `tstype:",extends"`
}

type GoogleJwt struct {
	Name                 string `json:"name"`
	Picture              string `json:"picture"`
	jwt.RegisteredClaims `tstype:",extends"`
}

func oauthGoogle(c echo.Context) error {
	u := new(OAuth)
	if err := c.Bind(u); err != nil {
		log.Fatal(err)
		return err
	}

	idTokenResp, err := exchangeTokenWithGoogle(u, c)
	if err != nil {
		log.Fatal(err)
		return echo.ErrInternalServerError
	}

	statement, err := db.Prepare(`INSERT INTO Users (id,name,picture) VALUES (?,?,?)`)
	if err != nil {
		log.Fatal(err)
		return echo.ErrInternalServerError
	}
	defer statement.Close()

	statement.Exec(idTokenResp.Subject, idTokenResp.Name, idTokenResp.Picture)

	claims := &AuthJwt{
		idTokenResp.Name,
		idTokenResp.Picture,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 7)), // implement logout on frontend
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	jsonToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := jsonToken.SignedString(getJwtSecretBytes())
	if err != nil {
		log.Fatal(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, OAuthResponse{
		Token: tokenString,
	})
}

func getJwtSecretBytes() []byte {
	jwtSecret, found := os.LookupEnv("JwtSecret")
	if !found {
		log.Fatal(".env missing JwtSecret")
	}
	log.Println(jwtSecret)

	secretBytes, err := base64.StdEncoding.DecodeString(jwtSecret)
	if err != nil {
		log.Fatal(err)
	}

	return secretBytes
}

func exchangeTokenWithGoogle(u *OAuth, c echo.Context) (*GoogleJwt, error) {
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
