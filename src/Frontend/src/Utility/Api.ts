import axios from "axios";
import { ChannelResponse, NewChannelRequest, OAuthResponse } from "../Types/ServerTypes";
import Constants from "./Constants";
import { enqueueSnackbar } from "notistack";

/**
 * GET /status
 */
function Status(): Promise<any> {
  const url = Constants.BackendUrl + "status";
  return AuthGet(url);
}

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
 * GET /login
 */
async function GetLogin(): Promise<ChannelResponse[]> {
  const url = Constants.BackendUrl + "channels";
  const resp = await axios.get<ChannelResponse[]>(url, config);
  return resp.data;
}

/**
 * GET /channels
 */
async function GetChannels(): Promise<ChannelResponse[]> {
  const url = Constants.BackendUrl + "channels";
  const resp = await axios.get<ChannelResponse[]>(url, config);
  return resp.data;
}

/**
 * POST /channels
 */
function PostChannels(data: NewChannelRequest) {
  const url = Constants.BackendUrl + "channels";
  return AuthPost<NewChannelRequest, number>(url, data);
}

const config = {
  headers: {
    Authorization: "Bearer " + localStorage.getItem(Constants.AccessTokenKey),
  },
};

async function AuthGet<Result>(url: string): Promise<Result> {
  try {
    const resp = await axios.get<Result>(url, config);
    return resp.data;
  } catch (error) {
    enqueueSnackbar("Error: " + error, { variant: "error" });
    return Promise.reject("Error");
  }
}

async function AuthPost<Data, Result>(url: string, data: Data): Promise<Result> {
  try {
    const resp = await axios.post<Result>(url, data, config);
    return resp.data;
  } catch (error) {
    enqueueSnackbar("Error: " + error, { variant: "error" });
    return Promise.reject("Error");
  }
}

export default {
  Status,
  AuthGoogle,
  GetLogin,
  GetChannels,
  PostChannels,
};
