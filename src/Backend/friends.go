package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func getFriends(c echo.Context) error {
	jwt := getJwt(c)

	rows, err := db.Query("Select id,username,picture FROM Users;")

	if err != nil {
		return apiError("Query", echo.ErrInternalServerError, err)
	}

	var Friends []Friend

	for rows.Next() {
		var channel Friend
		err := rows.Scan(&channel.Id, &channel.Username, &channel.Picture)

		if err != nil {
			return apiError("Scan", echo.ErrInternalServerError, err)
		}

		if channel.Id != jwt.Subject {
			Friends = append(Friends, channel)
		}
	}

	if err = rows.Err(); err != nil {
		return apiError("rows", echo.ErrInternalServerError, err)
	}

	return c.JSON(http.StatusOK, Friends)
}
