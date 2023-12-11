import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { ChannelResponse, Friend, GetMessageBody, OAuthResponse, PostChannelBody } from "../Types/ServerTypes";
import Constants from "./Constants";

export default class API {
  constructor() { }

  /**
   * GET /status
   */
  static Status(): Promise<any> {
    const url = Constants.BackendUrl + "status";
    try {
      return axios.get(url, this.getConfig());
    } catch (error) {
      return Promise.reject("Error");
    }
  }

  /**
   * POST /auth/google
   * @param code The code recieved from googles oauth2 code-flow
   */
  static async AuthGoogle(code: string): Promise<OAuthResponse> {
    const resp = await axios.post<OAuthResponse>(Constants.BackendUrl + "auth/google", {
      code: code,
    });
    return resp.data;
  }

  /**
   * GET /login
   */
  static async GetLogin(): Promise<ChannelResponse[]> {
    const url = Constants.BackendUrl + "channels";
    const resp = await axios.get<ChannelResponse[]>(url, this.getConfig());
    return resp.data;
  }

  /**
   * GET /channels
   */
  static async GetChannels(searchTerm = ""): Promise<ChannelResponse[]> {
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
  static PostChannels(data: PostChannelBody) {
    const url = Constants.BackendUrl + "channels";
    return this.AuthPost<PostChannelBody, number>(url, data);
  }

  /**
   * GET /message
   */
  static GetMessage() {
    const url = Constants.BackendUrl + "messages";
    return this.AuthGet<GetMessageBody>(url);
  }

  /**
   * POST /message
   */
  static PostMessage(data: GetMessageBody) {
    const url = Constants.BackendUrl + "messages";
    return this.AuthPost<GetMessageBody, number>(url, data);
  }

  /**
   * GET /message
   */
  static GetFriends() {
    const url = Constants.BackendUrl + "friends";
    return this.AuthGet<Friend[]>(url);
  }

  static async AuthGet<Result>(url: string): Promise<Result> {
    try {
      const resp = await axios.get<Result>(url, this.getConfig());
      return resp.data;
    } catch (error) {
      // enqueueSnackbar("Error: " + error, { variant: "error" });
      return Promise.reject("Error");
    }
  }

  static async AuthPost<Data, Result>(url: string, data: Data): Promise<Result> {
    try {
      const resp = await axios.post<Result>(url, data, this.getConfig());
      return resp.data;
    } catch (error) {
      // enqueueSnackbar("Api " + error, { variant: "error" });
      return Promise.reject("Error");
    }
  }

  static getConfig() {
    return {
      headers: {
        Authorization: "Bearer " + localStorage.getItem(Constants.AccessTokenKey),
      },
    };
  }

}
