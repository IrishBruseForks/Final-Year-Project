package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.CORS())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/status", status)

	e.Logger.Fatal(e.Start("localhost:1323"))
}

func status(c echo.Context) error {
	return c.String(http.StatusOK, "Alive")
}
