package main

type OAuth struct {
	Code string `json:"code"`
}

type OAuthResponse struct {
	Token string `json:"token"`
}
