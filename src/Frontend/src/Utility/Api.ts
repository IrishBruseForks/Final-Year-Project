import axios, { AxiosResponse } from "axios";
import Constants from "./Constants";
import { ChannelResponse, OAuthResponse } from "../Types/ServerTypes";

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
function Channels(): Promise<ChannelResponse[]> {
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

export default {
  AuthGoogle,
  Status,
  Channels,
};
