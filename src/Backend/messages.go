package main

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func getMessages(c echo.Context) error {
	var channelId string
	echo.QueryParamsBinder(c).MustString("id", &channelId)

	query := `
	SELECT
		channelId,sentBy,sentOn,content
	FROM
		Messages
	WHERE
		channelId = ?
	ORDER BY sentOn ASC;
	`

	rows, err := db.Query(query, channelId)
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

	id, err := uuid.NewRandom()
	if err != nil {
		return apiError("uuid", echo.ErrInternalServerError, err)
	}

	query := `
	INSERT INTO
		Messages (id,channelId,sentBy,sentOn,content)
	VALUES
		(?,?,?,NOW(),?);
	`

	_, err = db.Exec(query, id, msgRequest.ChannelId, jwt.Subject, msgRequest.Content)
	if err != nil {
		return apiError("postMessagesQuery", echo.ErrInternalServerError, err)
	}

	return c.String(http.StatusOK, id.String())
}
