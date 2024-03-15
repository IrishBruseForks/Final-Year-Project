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

type AuthJwt struct {
	Name                 string `json:"name"`
	Picture              string `json:"picture"`
	jwt.RegisteredClaims `tstype:",extends"`
}

func postLogin(c echo.Context) error {
	body, err := getBody[OAuth](c)
	if err != nil {
		log.Error(err)
		return err
	}

	googleJwt, err := exchangeTokenWithGoogle(body)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	tokenString, err := createApiJwt(googleJwt)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	row := db.QueryRow(`SELECT id,username,picture FROM Users WHERE id = ?`, googleJwt.Subject)

	var id *string = nil
	var username *string = nil
	var profilePicture *string = nil

	err = row.Scan(&id, &username, &profilePicture)

	if err != nil {
		query := `INSERT INTO Users (id,picture) VALUES (?,?)`

		_, err = db.Exec(query, googleJwt.Subject, googleJwt.Picture)
		if err != nil {
			log.Error(err)
			return echo.ErrInternalServerError
		}

		// The user does not exsit we need them to signup with a username
		return c.JSON(http.StatusOK, OAuthResponse{
			Signup: true,
			Token:  tokenString,
			Id:     googleJwt.Subject,
		})
	}

	if username == nil {
		// The user previously tried signing up but canceled or an error occured
		// they are in the db but have not picked a username
		return c.JSON(http.StatusOK, OAuthResponse{
			Signup:         true,
			Token:          tokenString,
			Id:             googleJwt.Subject,
			ProfilePicture: profilePicture,
		})
	}

	return c.JSON(http.StatusOK, OAuthResponse{
		Signup:         false,
		Token:          tokenString,
		Id:             googleJwt.Subject,
		ProfilePicture: profilePicture,
	})
}

func createApiJwt(idTokenResp *GoogleJwt) (string, error) {
	claims := &AuthJwt{
		idTokenResp.Name,
		idTokenResp.Picture,
		jwt.RegisteredClaims{
			Subject:   idTokenResp.Subject,
			Issuer:    "chatalyst",
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 7)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	jsonToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := jsonToken.SignedString(getJwtSecretBytes())
	return tokenString, err
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

func postSignup(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	jwt := user.Claims.(*AuthJwt)

	body, err := getBody[UsernameBody](c)
	if err != nil {
		log.Error(err)
		return err
	}

	url, err := UploadImage(jwt.Picture)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	query := `UPDATE Users SET username=?,picture=? WHERE id=?`
	_, err = db.Exec(query, body.Username, url, jwt.Subject)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, OAuthResponse{
		Id:             jwt.ID,
		Signup:         false,
		ProfilePicture: &url,
	})
}
