package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func getFriends(c echo.Context) error {
	rows, err := db.Query(`
	Select id,username,picture FROM Users;
	`)

	if err != nil {
		return apiError("Query", err, echo.ErrInternalServerError)
	}

	var Friends []Friend

	for rows.Next() {
		var channel Friend
		err := rows.Scan(&channel.Id, &channel.Username, &channel.Picture)

		if err != nil {
			return apiError("Scan", err, echo.ErrInternalServerError)
		}

		Friends = append(Friends, channel)
	}

	if err = rows.Err(); err != nil {
		return apiError("rows", err, echo.ErrInternalServerError)
	}

	return c.JSON(http.StatusOK, Friends)
}