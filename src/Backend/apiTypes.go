package main

type OAuth struct {
	Code string `json:"code"`
}

type OAuthResponse struct {
	Token string `json:"token"`
}

type ChannelResponse struct {
	Username    string `json:"username"`
	LastMessage string `json:"lastMessage"`
	ProfilePic  string `json:"profilePic"`
}
