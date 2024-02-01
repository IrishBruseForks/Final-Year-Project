package main

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"time"

	"github.com/labstack/gommon/log"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func getRoot(c echo.Context) error {
	return c.String(http.StatusOK, "Hello there 😁")
}

func getStatus(c echo.Context) error {
	return c.String(http.StatusOK, "Alive")
}

func getLogin(c echo.Context) error {
	user, ok := c.Get("user").(*jwt.Token)

	if !ok {
		return c.NoContent(http.StatusUnauthorized)
	}

	jwt := user.Claims.(*AuthJwt)
	log.Error(jwt.Name, "logged in")

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
		log.Error(err)
		return echo.ErrInternalServerError
	}

	if err := c.Validate(u); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	idTokenResp, err := exchangeTokenWithGoogle(u)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	statement, err := db.Prepare(`INSERT INTO Users (id,username,picture) VALUES (?,?,?)`)
	if err != nil {
		return echo.ErrInternalServerError
	}
	defer statement.Close()

	// TODO check if value is in db already
	_, err = statement.Exec(idTokenResp.Subject, idTokenResp.Name, idTokenResp.Picture)
	if err != nil {
		panic(err)
	}

	claims := &AuthJwt{
		idTokenResp.Name,
		idTokenResp.Picture,
		jwt.RegisteredClaims{
			Subject:   idTokenResp.Subject,
			Issuer:    "chatalyst",
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 7)), // 7 days
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	jsonToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := jsonToken.SignedString(getJwtSecretBytes())
	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, OAuthResponse{
		Token:          tokenString,
		Id:             idTokenResp.ID,
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
