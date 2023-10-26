package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	jwt "github.com/golang-jwt/jwt/v5"
	echo "github.com/labstack/echo/v4"
)

func getStatus(c echo.Context) error {
	return c.String(http.StatusOK, "Alive")
}

func getLogin(c echo.Context) error {
	user, ok := c.Get("user").(*jwt.Token)

	if !ok {
		return c.NoContent(http.StatusUnauthorized)
	}

	jwt := user.Claims.(*AuthJwt)
	fmt.Println(jwt)

	return c.NoContent(http.StatusOK)
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

	statement, err := db.Prepare(`INSERT INTO Users (id,username,picture) VALUES (?,?,?)`)
	if err != nil {
		log(err)
		return echo.ErrInternalServerError
	}
	defer statement.Close()

	// TODO check if value is in db already
	_, err = statement.Exec(idTokenResp.Subject, idTokenResp.Name, idTokenResp.Picture)
	if err != nil {
		log(err)
	}

	claims := &AuthJwt{
		idTokenResp.Name,
		idTokenResp.Picture,
		jwt.RegisteredClaims{
			Subject:   idTokenResp.Subject,
			Issuer:    "chatalyst",
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
		ProfilePicture: idTokenResp.Picture,
	})
}

func exchangeTokenWithGoogle(u *OAuth) (*GoogleJwt, error) {
	tok, err := config.Exchange(context.Background(), u.Code)
	if err != nil {
		return nil, err
	}

	client := config.Client(context.Background(), tok)
	idToken := tok.Extra("id_token").(string)

	resp, err := client.Get("https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken)
	if err != nil {
		return nil, err
	}

	bytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	idTokenResp := new(GoogleJwt)
	json.Unmarshal(bytes, idTokenResp)

	return idTokenResp, nil
}
