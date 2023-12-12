import {} from "@mui/material";
import { useEffect } from "react";
import Constants from "./Utility/Constants";
import { Logout } from "./Utility/LoginHandler";
import Urls from "./Utility/Urls";
import useApi from "./Utility/useApi";

function Globals({ router }: { router: typeof import("./router").router }) {
  const { isError: loginFailed } = useApi("getLogin", Urls.Login, { retry: false, refetchOnWindowFocus: true });

  // Check to see if the backend is running
  // if there is an exception redirect to service down page and keep retrying connection
  const { isError: serverFailed } = useApi("getStatusGlobal", Urls.Status, {
    retry(failureCount, error) {
      return failureCount < 1 && error === undefined;
    },
    refetchInterval: 2000,
  });

  useEffect(() => {
    // Check if we need to login again because we are either
    // missing the access token
    const token = localStorage.getItem(Constants.AccessTokenKey);

    if (token === null) {
      router.navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loginFailed && window.location.pathname !== "/login") {
      Logout();
      router.navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginFailed]);

  useEffect(() => {
    if (serverFailed) {
      router.navigate("/serviceDown");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverFailed]);

  return <></>;
}

export default Globals;
