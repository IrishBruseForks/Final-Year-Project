package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var config *oauth2.Config

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	clientSecret := os.Getenv("ClientSecret")
	clientID := os.Getenv("ClientID")

	config = &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		RedirectURL: "postmessage",
		Endpoint:    google.Endpoint,
	}

	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.CORS())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/status", status)
	e.POST("/oauth2/google", oauthGoogle)
	e.POST("/oauth2/google/callback", oauthGoogleCallback)

	e.Logger.Fatal(e.Start("localhost:1323"))
	e.Close()
}

func status(c echo.Context) error {
	return c.String(http.StatusOK, "Alive")
}

type OAuth struct {
	Code string `json:"code"`
}

func oauthGoogle(c echo.Context) error {
	u := new(OAuth)
	if err := c.Bind(u); err != nil {
		return err
	}

	tok, err := config.Exchange(context.Background(), u.Code)
	if err != nil {
		log.Fatal(err)
	}

	client := config.Client(context.Background(), tok)

	resp, err := client.Get("https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses")
	if err != nil {
		log.Fatal(err)
	}

	c.Logger().Info(resp.Body)

	return c.JSON(http.StatusOK, resp.Body)
}

func oauthGoogleCallback(c echo.Context) error {
	c.Logger().Info("test")
	return c.JSON(http.StatusOK, "resp.Body")

}
