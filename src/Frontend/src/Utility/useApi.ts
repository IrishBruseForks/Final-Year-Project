import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { enqueueSnackbar } from "notistack";
import { QueryKey, UseQueryOptions, UseQueryResult, useQuery } from "react-query";
import { useAuth } from "../Auth/useAuth";
import { OAuthResponse } from "../Types/ServerTypes";

export function useApi<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  url: string,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "queryFn">
): UseQueryResult<TData, TError> {
  const { user } = useAuth();

  return useQuery<TQueryFnData, TError, TData, TQueryKey>(
    queryKey,
    async (): Promise<TQueryFnData> => {
      if (!user) {
        return Promise.reject("Error getting user");
      }
      try {
        return (await axios.get(import.meta.env.VITE_API_URL + url, getApiConfig(user))).data as TQueryFnData;
      } catch (error) {
        const err = error as AxiosError;
        if ((err as AxiosError).isAxiosError) {
          enqueueSnackbar(err.message, { variant: "error" });
        } else {
          enqueueSnackbar<"error">(error as any);
        }

        throw error;
      }
    },
    options
  );
}

export function useRefetchApi<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  url: string,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "queryFn">
): UseQueryResult<TData, TError> {
  return useApi(queryKey, url, {
    ...options,
    refetchInterval(data, query) {
      if (typeof options?.refetchInterval !== "number") return false;
      if (data) return options?.refetchInterval;

      // Exponential backoff on error
      const time = options?.refetchInterval * 2 ** (query.state.errorUpdateCount + 1);

      return Math.min(time, 60000);
    },
  });
}

export function getApiConfig(user: OAuthResponse): AxiosRequestConfig {
  return {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };
}
