import axios from "axios";
import { OAuthResponse } from "../Types/ServerTypes";
import Constants from "./Constants";
import Urls from "./Urls";

type URL = (typeof Urls)[keyof typeof Urls];

async function Post<D = any, T = unknown>(url: URL, data: D): Promise<T> {
  return (await axios.post<T>(import.meta.env.VITE_API_URL + url, data, config())).data;
}

async function Delete<T = unknown>(url: URL): Promise<T> {
  return (await axios.delete<T>(import.meta.env.VITE_API_URL + url, config())).data;
}

function config() {
  let json = localStorage.getItem(Constants.UserKey);
  if (!json) {
    return {};
  }

  let user = JSON.parse(json) as OAuthResponse;

  return {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };
}

export default { Post, Delete };
