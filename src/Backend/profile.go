package main

import (
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

func getProfile(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	jwt := user.Claims.(*AuthJwt)

	var id *string = nil
	var username *string = nil
	var profilePicture *string = nil

	err := db.QueryRow("SELECT id,username,picture FROM Users WHERE id = ?", jwt.Subject).Scan(&id, &username, &profilePicture)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	var friends int
	err = db.QueryRow("SELECT COUNT(*) FROM Friends f WHERE f.user = ?", jwt.Subject).Scan(&friends)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	var channels int
	err = db.QueryRow("SELECT COUNT(*) FROM Users_Channels u WHERE u.Users_id = ?", jwt.Subject).Scan(&channels)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, &Profile{
		User: User{
			Id:       *id,
			Username: *username,
			Picture:  *profilePicture,
		},
		Friends:  friends,
		Channels: channels,
	})
}

func putProfile(c echo.Context) error {
	userId := getUserId(c)
	body, err := getBody[PutProfileBody](c)
	if err != nil {
		log.Error(err)
		return err
	}

	url, err := uploadImage(*body.Picture)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	query := `UPDATE Users SET picture=? WHERE id=?`
	_, err = db.Exec(query, url, userId)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	return c.NoContent(http.StatusOK)
}
