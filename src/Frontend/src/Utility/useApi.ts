import axios, { AxiosRequestConfig } from "axios";
import { QueryKey, UseQueryOptions, UseQueryResult, useQuery } from "react-query";
import Constants from "./Constants";

export default function useApi<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey>(queryKey: TQueryKey, url: string, data?: TData, options?:
    Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>): UseQueryResult<TData, TError> {
  return useQuery<TQueryFnData, TError, TData, TQueryKey>(queryKey, async (): Promise<TQueryFnData> => {
    if (data === null || data === undefined) {
      return (await axios.get(Constants.BackendUrl + url, getConfig())).data;
    } else {
      return (await (axios.post(Constants.BackendUrl + url, data, getConfig()))).data;
    }
  }, options);
}

function getConfig(): AxiosRequestConfig {
  return {
    timeout: 10000,
    headers: {
      Authorization: "Bearer " + localStorage.getItem(Constants.AccessTokenKey),
    },
  };
}
