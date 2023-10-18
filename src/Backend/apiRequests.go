package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	jwt "github.com/golang-jwt/jwt/v5"
	echo "github.com/labstack/echo/v4"
)

func getStatus(c echo.Context) error {
	return c.String(http.StatusOK, "Alive")
}

func postAuthGoogle(c echo.Context) error {
	u := new(OAuth)
	if err := c.Bind(u); err != nil {
		log.Fatal(err)
		return err
	}

	idTokenResp, err := exchangeTokenWithGoogle(u, c)
	if err != nil {
		fmt.Println(err)
		return echo.ErrInternalServerError
	}

	statement, err := db.Prepare(`INSERT INTO Users (userId,username,picture) VALUES (?,?,?)`)
	if err != nil {
		fmt.Println(err)
		return echo.ErrInternalServerError
	}
	defer statement.Close()

	fmt.Println(idTokenResp.Subject)

	_, err = statement.Exec(idTokenResp.Subject, idTokenResp.Name, idTokenResp.Picture)
	if err != nil {
		fmt.Println(err)
		return echo.ErrInternalServerError
	}

	claims := &AuthJwt{
		idTokenResp.Name,
		idTokenResp.Picture,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 7)), // implement logout on frontend
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	jsonToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := jsonToken.SignedString(getJwtSecretBytes())
	if err != nil {
		log.Fatal(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, OAuthResponse{
		Token: tokenString,
	})
}

func getChannels(c echo.Context) error {
	// TODO return only chats the user is in
	rows, err := db.Query("SELECT username, picture from Users;")
	if err != nil {
		fmt.Println(err)
		return echo.ErrInternalServerError
	}

	var channels []ChannelResponse

	for rows.Next() {
		var channel ChannelResponse

		channel.LastMessage = "TODO add get latest message"

		err := rows.Scan(&channel.Username, &channel.ProfilePic)
		if err != nil {
			fmt.Println(err)
			return echo.ErrInternalServerError
		}

		channels = append(channels, channel)
	}

	if err = rows.Err(); err != nil {
		fmt.Println(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, channels)
}
