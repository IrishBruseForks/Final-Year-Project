package main

type OAuth struct {
	Code string `json:"code"`
}

type OAuthResponse struct {
	Token          string `json:"token"`
	Sub            string `json:"sub"`
	ProfilePicture string `json:"profilePicture"`
}

type ChannelResponse struct {
	Username    string `json:"username"`
	LastMessage string `json:"lastMessage"`
	ProfilePic  string `json:"profilePic"`
}
