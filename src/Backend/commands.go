package main

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

func getCommands(c echo.Context) error {
	jwt := getJwt(c)

	// TODO return only chats the user is in
	rows, err := db.Query(`
	Select c.* FROM Commands c
		JOIN Users_Commands uc ON c.id = uc.Commands_id
	WHERE uc.Users_id = ?;
	`, jwt.Subject)

	if err != nil {
		return apiError("Query", err, echo.ErrInternalServerError)
	}

	var Commands []ChannelResponse

	for rows.Next() {
		var channel ChannelResponse
		err := rows.Scan(&channel.Id, &channel.Name, &channel.Picture, &channel.LastMessage)

		if err != nil {
			return apiError("Scan", err, echo.ErrInternalServerError)
		}

		Commands = append(Commands, channel)
	}

	if err = rows.Err(); err != nil {
		return apiError("rows", err, echo.ErrInternalServerError)
	}

	return c.JSON(http.StatusOK, Commands)
}

func postCommands(c echo.Context) error {
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
		Commands (name,picture,lastMessage)
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
		Users_Commands (Users_id, Commands_id)
	VALUES
		(?,?);
	`

	for _, user := range newChannelRequest.Users {
		_, err = db.Exec(addUserToChannelQuery, user, channelId)

		if err != nil {
			return apiError("userCommands", err, echo.ErrInternalServerError)
		}

	}

	return c.String(http.StatusOK, strconv.FormatInt(channelId, 10))
}

func putCommands(c echo.Context) error {
	// jwt := getJwt(c)

	return c.String(http.StatusOK, "putCommands")
}
