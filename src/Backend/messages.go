package main

import (
	"net/http"

	echo "github.com/labstack/echo/v4"
)

func getChannels(c echo.Context) error {
	// TODO return only chats the user is in
	rows, err := db.Query("SELECT username, picture from Users;")
	if err != nil {
		log(err)
		return echo.ErrInternalServerError
	}

	var channels []ChannelResponse

	for rows.Next() {
		var channel ChannelResponse

		channel.LastMessage = "TODO add get latest message"

		err := rows.Scan(&channel.Username, &channel.ProfilePic)
		if err != nil {
			log(err)
			return echo.ErrInternalServerError
		}

		channels = append(channels, channel)
	}

	if err = rows.Err(); err != nil {
		log(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, channels)
}

func postChannels(c echo.Context) error {
	return nil
}
