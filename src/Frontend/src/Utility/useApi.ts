import { QueryKey, UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/useAuth";
import { OAuthResponse } from "../Types/ServerTypes";
import Urls from "./Urls";

export function useApi<TQueryFnData = unknown, TError = AxiosError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  url: (typeof Urls)[keyof typeof Urls] | string,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "queryFn">
): UseQueryResult<TData, TError> {
  const { user, logout } = useAuth();
  let navigate = useNavigate();

  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    queryKey: queryKey,
    queryFn: async (): Promise<TQueryFnData> => {
      if (!user) {
        navigate("/login");
        return Promise.reject("Unauthorized");
      }
      try {
        return (await axios.get(import.meta.env.VITE_API_URL + url, getApiAuthConfig(user))).data as TQueryFnData;
      } catch (error) {
        if (error instanceof AxiosError) {
          // redirect on unauthorrized error
          if (error.response?.status === 401) {
            navigate("/login");
            logout();
            return Promise.reject("Unauthorized");
          }
        }

        throw error;
      }
    },
  });
}

export function useRefetchApi<TQueryFnData = unknown, TError = AxiosError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  url: string,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "queryFn" | "initialData">
): UseQueryResult<TData, TError> {
  const ret = useApi<TQueryFnData, TError, TData, TQueryKey>(queryKey, url as any, {
    ...options,
    refetchInterval: 5000,
  });

  return ret;
}

export function getApiAuthConfig(user: OAuthResponse): AxiosRequestConfig {
  return {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };
}
