package main

type OAuth struct {
	Code string `json:"code"`
}

type OAuthResponse struct {
	Token          string `json:"token"`
	ProfilePicture string `json:"profilePicture"`
}

type ChannelResponse struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Picture     string `json:"picture"`
	LastMessage *int64 `json:"lastMessage"`
}
