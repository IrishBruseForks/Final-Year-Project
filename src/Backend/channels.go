package main

import (
	"net/http"
	"strconv"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func getChannels(c echo.Context) error {
	jwt := getJwt(c)

	// TODO return only chats the user is in
	rows, err := db.Query(`
	Select c.* FROM Channels c
		JOIN Users_Channels uc ON c.id = uc.Channels_id
	WHERE uc.Users_id = ?;
	`, jwt.Subject)

	if err != nil {
		return apiError("Query", err, echo.ErrInternalServerError)
	}

	var channels []ChannelResponse

	for rows.Next() {
		var channel ChannelResponse
		err := rows.Scan(&channel.Id, &channel.Name, &channel.Picture, &channel.LastMessage)

		if err != nil {
			return apiError("Scan", err, echo.ErrInternalServerError)
		}

		channels = append(channels, channel)
	}

	if err = rows.Err(); err != nil {
		return apiError("rows", err, echo.ErrInternalServerError)
	}

	return c.JSON(http.StatusOK, channels)
}

func postChannels(c echo.Context) error {
	jwt := getJwt(c)
	var err error

	newChannelRequest := new(GetChannelBody)
	if err = c.Bind(&newChannelRequest); err != nil {
		return apiError("Bind", err, echo.ErrInternalServerError)
	}

	if err = c.Validate(newChannelRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	// Add the user who created the group to the group
	newChannelRequest.Users = append(newChannelRequest.Users, jwt.Subject)

	createChannelQuery := `
	INSERT INTO
		Channels (name,picture,lastMessage)
	VALUES
		(?,?,?);
	`
	res, err := db.Exec(createChannelQuery, jwt.Name, jwt.Picture, 0)
	if err != nil {
		return apiError("createChannelQuery", err, echo.ErrInternalServerError)
	}

	channelId, _ := res.LastInsertId()

	addUserToChannelQuery := `
	INSERT INTO
		Users_Channels (Users_id, Channels_id)
	VALUES
		(?,?);
	`

	for _, user := range newChannelRequest.Users {
		_, err = db.Exec(addUserToChannelQuery, user, channelId)

		if err != nil {
			return apiError("userChannels", err, echo.ErrInternalServerError)
		}

	}

	return c.String(http.StatusOK, strconv.FormatInt(channelId, 10))
}

func putChannels(c echo.Context) error {
	// jwt := getJwt(c)

	return c.String(http.StatusOK, "putChannels")
}

func getJwt(c echo.Context) *AuthJwt {
	user := c.Get("user").(*jwt.Token)
	return user.Claims.(*AuthJwt)
}
