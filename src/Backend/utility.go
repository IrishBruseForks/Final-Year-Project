package main

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"os"

	"github.com/go-playground/validator"
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

type GoogleJwt struct {
	Name                 string `json:"name"`
	Picture              string `json:"picture"`
	jwt.RegisteredClaims `tstype:",extends"`
}

func getJwtSecretBytes() []byte {
	secret, found := os.LookupEnv("JWT_SECRET")
	if !found {
		panic("JWT_SECRET missing in env var")
	}

	secretBytes, err := base64.StdEncoding.DecodeString(secret)
	if err != nil {
		panic(err)
	}

	return secretBytes
}

func getUser(c echo.Context) (user string) {
	jwt := c.Get("user").(*jwt.Token)
	return jwt.Claims.(*AuthJwt).Subject
}

func getUsername(c echo.Context) (user string) {
	jwt := c.Get("user").(*jwt.Token)
	return jwt.Claims.(*AuthJwt).Username
}

func getBody[T any](c echo.Context) (*T, error) {
	body := new(T)
	if err := c.Bind(body); err != nil {
		log.Error(err)
		return nil, echo.ErrInternalServerError
	}

	if err := c.Validate(body); err != nil {
		return nil, echo.NewHTTPError(http.StatusBadRequest, err)
	}

	return body, nil
}

type Error struct {
	Errors map[string]interface{} `json:"errors"`
}

func NewValidatorError(err error) Error {
	e := Error{}
	e.Errors = make(map[string]interface{})
	errs := err.(validator.ValidationErrors)
	for _, v := range errs {
		e.Errors[v.Field()] = fmt.Sprintf("%v", v.Tag())
	}
	return e
}
