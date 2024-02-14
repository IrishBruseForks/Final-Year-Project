package main

import (
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/labstack/gommon/log"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func getMessages(c echo.Context) error {
	var channelId string
	echo.QueryParamsBinder(c).MustString("id", &channelId)

	query := `
	SELECT
		channelId,sentBy,sentOn,content,image
	FROM
		Messages
	WHERE
		channelId = ?
	ORDER BY sentOn DESC;
	`

	rows, err := db.Query(query, channelId)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	messages := make([]PostMessageResponse, 0)

	for rows.Next() {
		var msg PostMessageResponse
		err := rows.Scan(&msg.ChannelId, &msg.SentBy, &msg.SentOn, &msg.Content, &msg.Image)
		if err != nil {
			log.Error(err)
			return echo.ErrInternalServerError
		}
		messages = append(messages, msg)
	}

	return c.JSON(http.StatusOK, messages)
}

func postMessages(c echo.Context) error {
	jwt := getJwt(c)

	msgRequest := new(PostMessageBody)

	if err := c.Bind(&msgRequest); err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	if err := c.Validate(msgRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	uuid, err := uuid.NewRandom()
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	var imageUrl string = ""

	if msgRequest.Image != nil {
		resp, err := http.PostForm("https://api.imgbb.com/1/upload?expiration=15552000&key="+os.Getenv("IMGBB_SECRET"), map[string][]string{
			"image": {*msgRequest.Image}, // lets assume its this file
		})

		if err != nil {
			log.Error(err)
			return echo.ErrInternalServerError
		}

		b, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Error(err)
			return echo.ErrInternalServerError
		}

		var imgbb *ImgBB

		log.Error(string(b))

		err = json.Unmarshal(b, &imgbb)

		if err != nil {
			log.Error(err)
			return echo.ErrInternalServerError
		}

		log.Error(imgbb.Status)
		log.Error(imgbb.Success)
		log.Error(imgbb.Data.URL)
		imageUrl = imgbb.Data.URL
	}

	query := `
	INSERT INTO
		Messages (id,channelId,sentBy,sentOn,content,image)
	VALUES
		(?,?,?,NOW(),?,?);
	`

	_, err = db.Exec(query, uuid, msgRequest.ChannelId, jwt.Subject, msgRequest.Content, imageUrl)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	return c.String(http.StatusOK, uuid.String())
}

type ImgBB struct {
	Data    Data  `json:"data"`
	Success bool  `json:"success"`
	Status  int64 `json:"status"`
}

type Data struct {
	ID         string `json:"id"`
	Title      string `json:"title"`
	URLViewer  string `json:"url_viewer"`
	URL        string `json:"url"`
	DisplayURL string `json:"display_url"`
	Width      int64  `json:"width"`
	Height     int64  `json:"height"`
	Size       int64  `json:"size"`
	Time       int64  `json:"time"`
	Expiration int64  `json:"expiration"`
	Image      Image  `json:"image"`
	Thumb      Image  `json:"thumb"`
	DeleteURL  string `json:"delete_url"`
}

type Image struct {
	Filename  string `json:"filename"`
	Name      string `json:"name"`
	MIME      string `json:"mime"`
	Extension string `json:"extension"`
	URL       string `json:"url"`
}
