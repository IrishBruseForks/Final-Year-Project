import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { enqueueSnackbar } from "notistack";
import { QueryKey, UseQueryOptions, UseQueryResult, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/useAuth";
import { OAuthResponse } from "../Types/ServerTypes";

export function useApi<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  url: string,
  errorMessage: string,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "queryFn">
): UseQueryResult<TData, TError> {
  const { user, logout } = useAuth();
  let navigate = useNavigate();

  return useQuery<TQueryFnData, TError, TData, TQueryKey>(
    queryKey,
    async (): Promise<TQueryFnData> => {
      if (!user) {
        navigate("/login");
        return Promise.reject("Unauthorized");
      }
      try {
        return (await axios.get(import.meta.env.VITE_API_URL + url, getApiAuthConfig(user))).data as TQueryFnData;
      } catch (error) {
        if (error instanceof AxiosError && error.isAxiosError) {
          // redirect on unauthorrized error
          if (error.response?.status === 401) {
            navigate("/login");
            logout();
            return Promise.reject("Unauthorized");
          }

          enqueueSnackbar(errorMessage + " - " + error.message, { variant: "error" });
        } else {
          enqueueSnackbar(error as any, { variant: "error" });
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
  errorMessage: string,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "queryFn">
): UseQueryResult<TData, TError> {
  return useApi(queryKey, url, errorMessage, {
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

export function getApiAuthConfig(user: OAuthResponse): AxiosRequestConfig {
  return {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };
}
