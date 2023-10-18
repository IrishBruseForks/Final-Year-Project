package main

import (
	"net/http"
	"time"

	jwt "github.com/golang-jwt/jwt/v5"
	echo "github.com/labstack/echo/v4"
)

func getStatus(c echo.Context) error {
	return c.String(http.StatusOK, "Alive")
}

type AuthJwt struct {
	Name                 string `json:"name"`
	Picture              string `json:"picture"`
	jwt.RegisteredClaims `tstype:",extends"`
}

func postAuthGoogle(c echo.Context) error {
	u := new(OAuth)
	if err := c.Bind(u); err != nil {
		log(err)
		return echo.ErrInternalServerError
	}

	idTokenResp, err := exchangeTokenWithGoogle(u)
	if err != nil {
		log(err)
		return echo.ErrInternalServerError
	}

	statement, err := db.Prepare(`INSERT INTO Users (userId,username,picture) VALUES (?,?,?)`)
	if err != nil {
		log(err)
		return echo.ErrInternalServerError
	}
	defer statement.Close()

	log(idTokenResp.Subject)

	// TODO check if value is in db already
	_, err = statement.Exec(idTokenResp.Subject, idTokenResp.Name, idTokenResp.Picture)
	if err != nil {
		log(err)
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
		log(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, OAuthResponse{
		Token:          tokenString,
		Sub:            idTokenResp.Subject,
		ProfilePicture: idTokenResp.Picture,
	})
}
