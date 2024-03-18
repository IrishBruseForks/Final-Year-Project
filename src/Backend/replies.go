package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"os"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

const prompt = `You are an AI assistant that provides civil suggestions for replies to text messages between real humans.
Do not reply with code, emojis, quotes, colons, or other special characters.
Below is the conversation with their names for reference.
Reply as if you were %s.
Do not reply with anything other than 3 choices prefixed with numbers.`

func getReplies(c echo.Context) error {
	messages := []string{
		"Ryan: Hello",
		"IrishBruse: Hi",
		"Ryan: How are you?",
		"IrishBruse: I'm doing well",
		"Ryan: What are you doing today?",
	}

	seed := rand.Intn(512)

	reply := Reply{
		Messages: []Message{
			{
				Role:    "system",
				Content: fmt.Sprintf(prompt, "IrishBruse"),
			},
			{
				Role:    "user",
				Content: strings.Join(messages, "\n"),
			},
		},
		Model:       "gpt-3.5-turbo",
		MaxTokens:   150,
		Temperature: 1,
		TopP:        0.9,
		Seed:        seed,
		Stream:      false,
	}

	data, err := json.Marshal(reply)
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	url := os.Getenv("AI_URL")
	token := os.Getenv("AI_TOKEN")

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(data))
	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	req.Header.Add("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return c.JSON(http.StatusOK, []string{})
	}

	if resp.StatusCode != http.StatusOK {
		// read all body
		body, _ := io.ReadAll(resp.Body)
		log.Error(string(body))
		fmt.Println(resp.StatusCode)

		return c.JSON(http.StatusOK, []string{"a", "Generate Lorem Ipsum placeholder text. Select the number of characters, words", "c"})
	}

	var res OpenAI
	err = json.NewDecoder(resp.Body).Decode(&res)

	if err != nil {
		log.Error(err)
		return echo.ErrInternalServerError
	}

	message := res.Choices[0].Message.Content

	choices := strings.Split(message, "\n")
	for i := 0; i < 3; i++ {
		choices[i] = strings.TrimPrefix(choices[i], fmt.Sprintf("%d. ", i+1))
	}

	return c.JSON(http.StatusOK, choices)
}

type Reply struct {
	Messages    []Message `json:"messages"`
	Model       string    `json:"model"`
	MaxTokens   int       `json:"max_tokens"`
	Temperature float32   `json:"temperature"`
	TopP        float32   `json:"top_p"`
	Seed        int       `json:"seed"`
	Stream      bool      `json:"stream"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type OpenAI struct {
	ID      string   `json:"id"`
	Object  string   `json:"object"`
	Created int64    `json:"created"`
	Model   string   `json:"model"`
	Choices []Choice `json:"choices"`
}

type Choice struct {
	Index        int64   `json:"index"`
	FinishReason string  `json:"finish_reason"`
	Text         string  `json:"text"`
	Message      Message `json:"message"`
}
