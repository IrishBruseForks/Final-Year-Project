package main

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/go-playground/validator"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	sslString, found := os.LookupEnv("SSL")
	val, err := strconv.ParseBool(sslString)

	if found && err == nil {
		useSSL = val
	}
}

type GoogleJwt struct {
	Name                 string `json:"name"`
	Picture              string `json:"picture"`
	jwt.RegisteredClaims `tstype:",extends"`
}

func getJwtSecretBytes() []byte {
	jwtSecret, found := os.LookupEnv("JwtSecret")
	if !found {
		panic(".env missing JwtSecret")
	}

	secretBytes, err := base64.StdEncoding.DecodeString(jwtSecret)
	if err != nil {
		panic(err)
	}

	return secretBytes
}

func getJwt(c echo.Context) *AuthJwt {
	user := c.Get("user").(*jwt.Token)
	return user.Claims.(*AuthJwt)
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
