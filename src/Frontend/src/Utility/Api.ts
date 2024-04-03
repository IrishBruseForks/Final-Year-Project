import axios from "axios";
import { OAuthResponse } from "../Types/ServerTypes";

type URL = string;

async function Post<D = any, T = unknown>(url: URL, data: D): Promise<T> {
  return (await axios.post<T>(import.meta.env.VITE_API_URL + url, data, config())).data;
}

async function Delete<T = unknown>(url: URL): Promise<T> {
  return (await axios.delete<T>(import.meta.env.VITE_API_URL + url, config())).data;
}

async function Get<T = unknown>(url: URL): Promise<T> {
  return (await axios.get<T>(import.meta.env.VITE_API_URL + url, config())).data;
}

function config() {
  let json = localStorage.getItem("user");
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

export default { Post, Delete, Get };
