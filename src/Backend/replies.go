package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

const prompt = `### Instruction:
You are an AI assistant that provides civil suggestions for replies to text messages between real humans.
Do not reply with code, emojis, quotes, colons, or other special characters.
Input is the conversation with their names for reference.
Reply as if you were %s.
Do not reply with anything other than the 3 choices.

### Input:
%s

### Response:
Sure here are the 3 replies only:

1.`

func getReplies(c echo.Context) error {
	// jwt := c.Get("user").(*jwt.Token)
	// username := jwt.Claims.(*AuthJwt).Name

	username := "Ethan"
	messages := []string{
		"Ryan: Hello",
		"Ethan: Hi",
		"Ryan: How are you?",
		"Ethan: I'm doing well",
		"Ryan: What are you doing today?",
	}

	seed := rand.Intn(512)

	log.Debug("seed:", seed)

	chat := strings.Join(messages, "\n")
	reply := Reply{
		Prompt:      fmt.Sprintf(prompt, username, chat),
		MaxTokens:   150,
		Temperature: 1,
		TopP:        0.8,
		Seed:        seed,
		Stream:      false,
	}

	fmt.Print(reply.Prompt)

	data, err := json.Marshal(reply)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	resp, err := http.Post(os.Getenv("AI_URL"), "application/json", bytes.NewBuffer(data))
	if err != nil {
		return c.JSON(http.StatusOK, []string{})
	}

	var res OpenAI

	err = json.NewDecoder(resp.Body).Decode(&res)

	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	choices := res.Choices[0].Text

	fmt.Println(choices)

	return c.JSON(http.StatusOK, []string{
		choices,
	})
}

type Reply struct {
	Prompt      string  `json:"prompt"`
	MaxTokens   int     `json:"max_tokens"`
	Temperature float32 `json:"temperature"`
	TopP        float32 `json:"top_p"`
	Seed        int     `json:"seed"`
	Stream      bool    `json:"stream"`
}

type OpenAI struct {
	ID      string   `json:"id"`
	Object  string   `json:"object"`
	Created int64    `json:"created"`
	Model   string   `json:"model"`
	Choices []Choice `json:"choices"`
}

type Choice struct {
	Index        int64  `json:"index"`
	FinishReason string `json:"finish_reason"`
	Text         string `json:"text"`
}
