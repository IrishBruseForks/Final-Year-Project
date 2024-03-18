package main

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

func getChannel(c echo.Context) error {
	var channelId string
	echo.QueryParamsBinder(c).MustString("id", &channelId)

	rows, err := db.Query(`
	SELECT u.* FROM Users_Channels
	JOIN Users u ON u.id = Users_id
	WHERE Users_Channels.Channels_id = ?;
	`, channelId)

	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	var users []User

	for rows.Next() {
		var user User
		err := rows.Scan(&user.Id, &user.Username, &user.Picture)
		if err != nil {
			log.Error(err)
			return echo.ErrInternalServerError
		}

		users = append(users, user)
	}
	var channel ChannelResponse

	if len(users) == 0 {
		log.Error(err)
		return echo.ErrForbidden
	}

	channel.Users = users

	rows, err = db.Query(`
	SELECT * FROM Channels
	WHERE id = ?;
	`, channelId)

	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	for rows.Next() {
		err := rows.Scan(&channel.Id, &channel.Name, &channel.Picture)

		if err != nil {
			log.Error(err)
			return echo.ErrInternalServerError
		}
	}

	if err = rows.Err(); err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, &channel)
}

func getChannels(c echo.Context) error {
	user := getUser(c)

	// TODO return only chats the user is in
	rows, err := db.Query(`
	SELECT c.*, m.content FROM Channels c
	JOIN Users_Channels uc ON c.id = uc.Channels_id
	LEFT JOIN Messages m ON m.id = (
		SELECT id FROM Messages m
		WHERE m.channelId = c.id
		ORDER BY m.sentOn
		DESC LIMIT 1
	)
	WHERE uc.Users_id = ?
	`, user)

	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	var channels []ChannelsResponse

	for rows.Next() {
		var channel ChannelsResponse
		err := rows.Scan(&channel.Id, &channel.Name, &channel.Picture, &channel.LastMessage)

		if err != nil {
			log.Error(err)
			return echo.ErrInternalServerError
		}

		channels = append(channels, channel)
	}

	if err = rows.Err(); err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, channels)
}

func postChannels(c echo.Context) error {
	body, err := getBody[PostChannelBody](c)
	if err != nil {
		log.Error(err)
		return err
	}
	user := getUser(c)

	// Add the user who created the group to the group
	body.Users = append(body.Users, user)

	id, err := uuid.NewRandom()
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	var img string = ""

	if body.Picture != nil {
		uploadedImage, err := UploadImage(*body.Picture)

		if err != nil {
			log.Error(err)
		} else {
			img = uploadedImage
		}
	}

	createChannelQuery := `INSERT INTO Channels (id,name,picture) VALUES (?,?,?);`
	_, err = db.Exec(createChannelQuery, id.String(), body.Name, img)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	addUserToChannelQuery := `INSERT INTO Users_Channels (Users_id,Channels_id) VALUES (?,?);`

	for _, user := range body.Users {
		_, err = db.Exec(addUserToChannelQuery, user, id.String())

		if err != nil {
			log.Error(err, user, id.String())
			return echo.ErrInternalServerError
		}
	}

	return c.String(http.StatusOK, id.String())
}

func putChannels(c echo.Context) error {
	return c.String(http.StatusOK, "putChannels")
}

func deleteChannels(c echo.Context) error {
	body, err := getBody[DeleteChannelBody](c)
	if err != nil {
		log.Error(err)
		return err
	}
	user := getUser(c)

	query := `DELETE FROM Users_Channels WHERE Users_id=? AND Channels_id=?;`

	_, err = db.Exec(query, user, body.ChannelId)

	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	return c.NoContent(http.StatusOK)
}
