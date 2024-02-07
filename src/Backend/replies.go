package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func getReplies(c echo.Context) error {
	return c.JSON(http.StatusOK, [3]string{
		"Reply 1",
		"Reply 2 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		"Reply 3",
	})
}
