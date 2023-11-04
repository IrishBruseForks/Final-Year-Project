package main

type OAuth struct {
	Code string `json:"code" validate:"required"`
}

type GetChannelBody struct {
	Users []string `json:"users" validate:"required"`
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

type GetMessageBody struct {
	ChannelId int64 `json:"channelId" validate:"required"`
}

type PostMessageBody struct {
	ChannelId int64  `json:"channelId" validate:"required"`
	Content   string `json:"content"`
}

type PostMessageResponse struct {
	ChannelId string `json:"channelId"`
	SentBy    string `json:"sentBy"`
	SentOn    string `json:"sentOn"`
	Content   string `json:"content"`
}
