package main

type OAuth struct {
	Code string `json:"code" validate:"required"`
}

type PostChannelBody struct {
	Name    string   `json:"name" validate:"required"`
	Picture string   `json:"picture" validate:"required"`
	Users   []string `json:"users" validate:"required"`
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
	UserIDs     string `json:"userIds"`
}

type GetMessageBody struct {
	ChannelId string `query:"id" validate:"required"`
}

type Friend struct {
	Id       string `json:"id" validate:"required"`
	Username string `json:"username" validate:"required"`
	Picture  string `json:"picture" validate:"required"`
}

type PostMessageBody struct {
	ChannelId string `json:"channelId" validate:"required"`
	Content   string `json:"content" validate:"required"`
}

type PostMessageResponse struct {
	ChannelId string `json:"channelId"`
	SentBy    string `json:"sentBy"`
	SentOn    string `json:"sentOn"`
	Content   string `json:"content"`
}
