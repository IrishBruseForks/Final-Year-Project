package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/labstack/gommon/log"
	"github.com/microcosm-cc/bluemonday"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

var htmlSanitizer = bluemonday.StripTagsPolicy()

func getMessages(c echo.Context) error {
	user := getUser(c)

	var channelId string
	echo.QueryParamsBinder(c).MustString("id", &channelId)

	var userId string
	err := db.QueryRow("SELECT `Users_id` FROM `Users_Channels` u WHERE u.Channels_id=? AND u.Users_id=? LIMIT 1", channelId, user).Scan(&userId)

	if err != nil || user != userId {
		return echo.ErrForbidden
	}

	query := `
	SELECT
		id,sentBy,sentOn,content,image
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
		err := rows.Scan(&msg.Id, &msg.SentBy, &msg.SentOn, &msg.Content, &msg.Image)
		if err != nil {
			log.Error(err)
			return echo.ErrInternalServerError
		}
		messages = append(messages, msg)
	}

	return c.JSON(http.StatusOK, messages)
}

func postMessages(c echo.Context) error {
	body, err := getBody[PostMessageBody](c)
	if err != nil {
		log.Error(err)
		return err
	}
	user := getUser(c)

	body.Content = strings.TrimSpace(htmlSanitizer.Sanitize(body.Content))

	fmt.Println(body.Content)

	if len(body.Content) == 0 {
		return echo.ErrBadRequest
	}

	uuid, err := uuid.NewRandom()
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	var imageUrl string = ""

	if body.Image != nil {
		// lets assume its this file
		url, err := UploadImage(*body.Image)
		if err != nil {
			log.Error(err)
			return echo.ErrInternalServerError
		}
		imageUrl = url
	}

	query := `
	INSERT INTO
		Messages (id,channelId,sentBy,sentOn,content,image)
	VALUES
		(?,?,?,NOW(),?,?);
	`

	_, err = db.Exec(query, uuid, body.ChannelId, user, body.Content, imageUrl)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	return c.String(http.StatusOK, uuid.String())
}

func UploadImage(img string) (string, error) {
	resp, err := http.PostForm("https://api.imgbb.com/1/upload?expiration=1000000&key="+os.Getenv("IMGBB_SECRET"), map[string][]string{
		"image": {img},
	})

	if err != nil {
		log.Error(err)
		return "", echo.ErrInternalServerError
	}

	b, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Error(err)
		return "", echo.ErrInternalServerError
	}

	var imgbb *ImgBB

	err = json.Unmarshal(b, &imgbb)
	if err != nil {
		log.Error(err)
		return "", echo.ErrInternalServerError
	}

	return imgbb.Data.Image.URL, err
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
