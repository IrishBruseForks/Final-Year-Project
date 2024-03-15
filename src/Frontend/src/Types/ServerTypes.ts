// Code generated by tygo. DO NOT EDIT.

//////////
// source: apiTypes.go

export interface OAuth {
  code: string;
}
export interface UsernameBody {
  username: string;
}
export interface PostChannelBody {
  name: string;
  users: string[];
  picture?: string;
}
export interface DeleteChannelBody {
  channelId: string;
}
export interface OAuthResponse {
  signup: boolean;
  token: string;
  id: string;
  profilePicture?: string;
}
export interface ChannelsResponse {
  id: string;
  name: string;
  picture: string;
  lastMessage?: string;
}
export interface ChannelResponse {
  id: string;
  name: string;
  picture: string;
  lastMessage?: number /* int64 */;
  users: User[];
}
export interface User {
  id: string;
  username: string;
  picture: string;
}
export interface PostMessageBody {
  channelId: string;
  content: string;
  image?: string;
}
export interface PostMessageResponse {
  id: string;
  sentBy: string;
  sentOn: string;
  content: string;
  image?: string;
}
