package main

import (
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func getChannels(c echo.Context) error {
    jwt := getJwt(c)
    searchTerm := c.QueryParam("search") // Retrieve the search term from query parameters

    var query string
    var args []interface{}

    baseQuery := `
        SELECT c.id, c.name, c.picture, c.lastMessage, GROUP_CONCAT(uc.Users_id) as userIDs
        FROM Channels c
        JOIN Users_Channels uc ON c.id = uc.Channels_id
        WHERE uc.Users_id = ?
    `
    args = append(args, jwt.Subject)

    if searchTerm != "" {
        // Modify the query to include a LIKE clause for search
        query = baseQuery + " AND c.name LIKE ? GROUP BY c.id, c.name, c.picture, c.lastMessage;"
        args = append(args, "%"+searchTerm+"%")
    } else {
        query = baseQuery + " GROUP BY c.id, c.name, c.picture, c.lastMessage;"
    }

    rows, err := db.Query(query, args...)
    if err != nil {
        return apiError("Query", echo.ErrInternalServerError, err)
    }

    var channels []ChannelResponse

    for rows.Next() {
        var channel ChannelResponse
        err := rows.Scan(&channel.Id, &channel.Name, &channel.Picture, &channel.LastMessage, &channel.UserIDs)
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