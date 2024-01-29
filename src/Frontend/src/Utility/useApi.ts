import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { enqueueSnackbar } from "notistack";
import { QueryKey, UseQueryOptions, UseQueryResult, useQuery } from "react-query";
import { useAuth } from "../Auth/useAuth";
import { OAuthResponse } from "../Types/ServerTypes";

export default function useApi<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
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
        return (await axios.get(import.meta.env.VITE_API_URL + url, getConfig(user))).data as TQueryFnData;
      } catch (error) {
        const err = error as AxiosError;
        if ((err as AxiosError).isAxiosError) {
          enqueueSnackbar(err.message + ": " + err.code, { variant: "error" });
        } else {
          enqueueSnackbar<"error">(error as any);
        }

        throw error;
      }
    },
    options
  );
}

export function getConfig(user: OAuthResponse): AxiosRequestConfig {
  return {
    timeout: 10000,
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };
}
