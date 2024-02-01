package main

import (
	"net/http"

	"github.com/labstack/gommon/log"

	"github.com/labstack/echo/v4"
)

func getFriends(c echo.Context) error {
	jwt := getJwt(c)

	rows, err := db.Query("Select id,username,picture FROM Users;")

	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	var Friends []User

	for rows.Next() {
		var channel User
		err := rows.Scan(&channel.Id, &channel.Username, &channel.Picture)

		if err != nil {
			log.Error(err)
			return echo.ErrInternalServerError
		}

		if channel.Id != jwt.Subject {
			Friends = append(Friends, channel)
		}
	}

	if err = rows.Err(); err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, Friends)
}
