import axios from "axios";
import { ChannelResponse, OAuthResponse } from "../Types/ServerTypes";
import Constants from "./Constants";

/**
 * POST /auth/google
 * @param code The code recieved from googles oauth2 code-flow
 */
async function AuthGoogle(code: string): Promise<OAuthResponse> {
  const resp = await axios.post<OAuthResponse>(Constants.BackendUrl + "auth/google", {
    code: code,
  });
  return resp.data;
}

/**
 * GET /status
 */
function Status(): Promise<any> {
  const url = Constants.BackendUrl + "status";
  return axios.get(url);
}

/**
 * GET /channels
 */
function GetChannels(): Promise<ChannelResponse[]> {
  const url = Constants.BackendUrl + "channels";
  return AuthGet<ChannelResponse[]>(url);
}

/**
 * POST /channels
 */
function PostChannels() {
  const url = Constants.BackendUrl + "channels";
  return AuthGet<ChannelResponse[]>(url);
}

async function AuthGet<Res>(url: string): Promise<Res> {
  const resp = await axios.get<Res>(Constants.BackendUrl + url, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem(Constants.AccessTokenKey),
    },
  });

  return resp.data;
}

async function AuthPost<Res, Data>(url: string, data: Data): Promise<Res> {
  const resp = await axios.post<Res>(Constants.BackendUrl + url, data, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem(Constants.AccessTokenKey),
    },
  });

  return resp.data;
}

export default {
  AuthGoogle,
  Status,
  GetChannels,
  PostChannels,
};
