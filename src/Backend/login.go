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
	Username             string `json:"username"`
	jwt.RegisteredClaims `tstype:",extends"`
}

type SignupJwt struct {
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

	var id *string = nil
	var username *string = nil
	var profilePicture *string = nil

	err = db.QueryRow(`SELECT id,username,picture FROM Users WHERE id = ?`, googleJwt.Subject).Scan(&id, &username, &profilePicture)

	if err != nil || username == nil {

		if profilePicture == nil {

			query := `INSERT INTO Users (id,picture) VALUES (?,?)`

			url, err := uploadImage(googleJwt.Picture)
			if err != nil {
				log.Error(err)
				return echo.ErrInternalServerError
			}

			_, err = db.Exec(query, googleJwt.Subject, url)
			if err != nil {
				log.Error(err)
				return echo.ErrInternalServerError
			}
		}

		tokenString, err := createSignupJwt(googleJwt)
		if err != nil {
			log.Error(err)
			return echo.ErrInternalServerError
		}

		log.Error(tokenString)

		// The user does not exsit we need them to signup with a username
		return c.JSON(http.StatusOK, OAuthResponse{
			Signup: true,
			Token:  tokenString,
			Id:     googleJwt.Subject,
		})
	}

	tokenString, err := createApiJwt(googleJwt.Subject, *username)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, OAuthResponse{
		Signup:         false,
		Token:          tokenString,
		Id:             googleJwt.Subject,
		ProfilePicture: profilePicture,
	})
}

func postSignup(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	jwt := user.Claims.(*SignupJwt)

	body, err := getBody[UsernameBody](c)
	if err != nil {
		log.Error(err)
		return err
	}

	query := `UPDATE Users SET username=? WHERE id=?`
	_, err = db.Exec(query, body.Username, jwt.Subject)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	tokenString, err := createApiJwt(jwt.Subject, body.Username)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, OAuthResponse{
		Id:     jwt.ID,
		Signup: false,
		Token:  tokenString,
	})
}

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

func createApiJwt(id string, username string) (string, error) {
	claims := &AuthJwt{
		username,
		jwt.RegisteredClaims{
			Subject:   id,
			Issuer:    "chatalyst",
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 7)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	jsonToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := jsonToken.SignedString(getJwtSecretBytes())
	return tokenString, err
}

func createSignupJwt(idTokenResp *GoogleJwt) (string, error) {
	claims := &SignupJwt{
		idTokenResp.Picture,
		jwt.RegisteredClaims{
			Subject:   idTokenResp.Subject,
			Issuer:    "chatalyst",
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
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
