package main

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

func getMessages(c echo.Context) error {
	var message GetMessageBody
	if err := c.Bind(&message); err != nil {
		return apiError("bind", echo.ErrInternalServerError, err)
	}

	if err := c.Validate(message); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	query := `
	SELECT
		channelId,sentBy,sentOn,content
	FROM
		Messages
	WHERE
		channelId = ?;
	`

	rows, err := db.Query(query, message.ChannelId)
	if err != nil {
		return apiError("getMessagesQuery", echo.ErrInternalServerError, err)
	}

	messages := make([]PostMessageResponse, 0)

	for rows.Next() {
		var msg PostMessageResponse
		err := rows.Scan(&msg.ChannelId, &msg.SentBy, &msg.SentOn, &msg.Content)
		if err != nil {
			return apiError("rows.Scan", echo.ErrInternalServerError, err)
		}
		messages = append(messages, msg)
	}

	return c.JSON(http.StatusOK, messages)
}

func postMessages(c echo.Context) error {
	jwt := getJwt(c)

	msgRequest := new(PostMessageBody)

	if err := c.Bind(&msgRequest); err != nil {
		return apiError("Bind", echo.ErrInternalServerError, err)
	}

	if err := c.Validate(msgRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	query := `
	INSERT INTO
		Messages (channelId,sentBy,sentOn,content)
	VALUES
		(?,?,NOW(),?);
	`

	res, err := db.Exec(query, msgRequest.ChannelId, jwt.Subject, msgRequest.Content)
	if err != nil {
		return apiError("createChannelQuery", echo.ErrInternalServerError, err)
	}

	i, err := res.LastInsertId()
	if err != nil {
		return apiError("LastInsertId", echo.ErrInternalServerError, err)
	}
	return c.String(http.StatusOK, strconv.FormatInt(i, 10))
}
