import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { ChannelResponse, Friend, GetMessageBody, OAuthResponse, PostChannelBody } from "../Types/ServerTypes";
import Constants from "./Constants";

/**
 * GET /status
 */
function Status(): Promise<any> {
  const url = Constants.BackendUrl + "status";
  try {
    return axios.get(url, getConfig());
  } catch (error) {
    return Promise.reject("Error");
  }
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
  const resp = await axios.get<ChannelResponse[]>(url, getConfig());
  return resp.data;
}

/**
 * GET /channels
 */
async function GetChannels(searchTerm = ""): Promise<ChannelResponse[]> {
  const params = searchTerm ? { search: encodeURIComponent(searchTerm) } : {};
  try {
    const response = await axios.get<ChannelResponse[]>(`${Constants.BackendUrl}channels`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem(Constants.AccessTokenKey),
      },
      params,
    });
    return response.data;
  } catch (error: unknown) {
    // error is typed as unknown
    // Check if the error is an instance of Error
    if (error instanceof Error) {
      enqueueSnackbar("Error fetching channels: " + error.message, { variant: "error" });
    } else {
      enqueueSnackbar("An unknown error occurred", { variant: "error" });
    }
    throw error;
  }
}

/**
 * POST /channels
 */
function PostChannels(data: PostChannelBody) {
  const url = Constants.BackendUrl + "channels";
  return AuthPost<PostChannelBody, number>(url, data);
}

/**
 * GET /message
 */
function GetMessage() {
  const url = Constants.BackendUrl + "messages";
  return AuthGet<GetMessageBody>(url);
}

/**
 * POST /message
 */
function PostMessage(data: GetMessageBody) {
  const url = Constants.BackendUrl + "messages";
  return AuthPost<GetMessageBody, number>(url, data);
}

/**
 * GET /message
 */
function GetFriends() {
  const url = Constants.BackendUrl + "friends";
  return AuthGet<Friend[]>(url);
}

async function AuthGet<Result>(url: string): Promise<Result> {
  try {
    const resp = await axios.get<Result>(url, getConfig());
    return resp.data;
  } catch (error) {
    enqueueSnackbar("Error: " + error, { variant: "error" });
    return Promise.reject("Error");
  }
}

async function AuthPost<Data, Result>(url: string, data: Data): Promise<Result> {
  try {
    const resp = await axios.post<Result>(url, data, getConfig());
    return resp.data;
  } catch (error) {
    enqueueSnackbar("Api " + error, { variant: "error" });
    return Promise.reject("Error");
  }
}

function getConfig() {
  return {
    headers: {
      Authorization: "Bearer " + localStorage.getItem(Constants.AccessTokenKey),
    },
  };
}

export default {
  Status,
  AuthGoogle,
  GetLogin,
  GetChannels,
  PostChannels,
  GetMessage,
  PostMessage,
  GetFriends,
};
