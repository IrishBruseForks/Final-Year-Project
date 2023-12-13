package main

import (
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func getChannel(c echo.Context) error {
	var channelId string
	echo.QueryParamsBinder(c).MustString("id", &channelId)

	fmt.Println(channelId)

	// TODO return only chats the user is in
	rows, err := db.Query(`
	SELECT
		u.*
	FROM
		Users_Channels
	JOIN
		Users u ON u.id = Users_id
	WHERE
		Users_Channels.Channels_id = ?;
	`, channelId)

	if err != nil {
		return apiError("Query", echo.ErrInternalServerError, err)
	}

	var users []User

	for rows.Next() {
		var user User
		err := rows.Scan(&user.Id, &user.Username, &user.Picture, &user.IsBot)
		fmt.Println(user)
		if err != nil {
			return apiError("Scan", echo.ErrInternalServerError, err)
		}

		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		return apiError("rows", echo.ErrInternalServerError, err)
	}

	return c.JSON(http.StatusOK, &ChannelResponse{
		Users: users,
	})
}

func getChannels(c echo.Context) error {
	jwt := getJwt(c)

	// TODO return only chats the user is in
	rows, err := db.Query(`
	Select c.* FROM Channels c
		JOIN Users_Channels uc ON c.id = uc.Channels_id
	WHERE uc.Users_id = ?;
	`, jwt.Subject)

	if err != nil {
		return apiError("Query", echo.ErrInternalServerError, err)
	}

	var channels []ChannelsResponse

	for rows.Next() {
		var channel ChannelsResponse
		err := rows.Scan(&channel.Id, &channel.Name, &channel.Picture, &channel.LastMessage)

		if err != nil {
			return apiError("Scan", echo.ErrInternalServerError, err)
		}

		channels = append(channels, channel)
	}

	if err = rows.Err(); err != nil {
		return apiError("rows", echo.ErrInternalServerError, err)
	}

	return c.JSON(http.StatusOK, channels)
}

func postChannels(c echo.Context) error {
	jwt := getJwt(c)
	var err error

	newChannelRequest := new(PostChannelBody)
	if err = c.Bind(&newChannelRequest); err != nil {
		return apiError("Bind", echo.ErrInternalServerError, err)
	}

	if err = c.Validate(newChannelRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	// Add the user who created the group to the group
	newChannelRequest.Users = append(newChannelRequest.Users, jwt.Subject)

	id, err := uuid.NewRandom()
	if err != nil {
		return apiError("uuid", echo.ErrInternalServerError, err)
	}

	createChannelQuery := `
	INSERT INTO
		Channels (id,name,picture,lastMessage)
	VALUES
		(?,?,?,?);
	`

	_, err = db.Exec(createChannelQuery, id.String(), newChannelRequest.Name, newChannelRequest.Picture, 0) // TODO implement last channel message
	if err != nil {
		return apiError("createChannelQuery", echo.ErrInternalServerError, err)
	}

	addUserToChannelQuery := `
	INSERT INTO
		Users_Channels (Users_id, Channels_id)
	VALUES
		(?,?);
	`

	for _, user := range newChannelRequest.Users {
		fmt.Println(user, id)
		_, err = db.Exec(addUserToChannelQuery, user, id.String())

		if err != nil {
			return apiError("userChannels", echo.ErrInternalServerError, err)
		}
	}

	return c.String(http.StatusOK, id.String())
}

func putChannels(c echo.Context) error {
	// jwt := getJwt(c)

	return c.String(http.StatusOK, "putChannels")
}
