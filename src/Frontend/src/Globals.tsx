import {} from "@mui/material";
import { useEffect } from "react";
import Constants from "./Utility/Constants";
import Urls from "./Utility/Urls";
import useApi from "./Utility/useApi";

function Globals({ router }: { router: typeof import("./router").router }) {
  const { isError: loginFailed } = useApi("getLogin", Urls.Login);

  // Check to see if the backend is running
  // if there is an exception redirect to service down page and keep retrying connection
  const { isError: serverFailed, isRefetchError } = useApi("getStatusGlobal", Urls.Status, null, { refetchInterval: 2000 });

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
    console.log(serverFailed, isRefetchError);

    // if (loginFailed) {
    //   localStorage.removeItem(Constants.AccessTokenKey);
    //   localStorage.removeItem(Constants.ProfilePictureKey);
    //   router.navigate("/login");
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverFailed, isRefetchError]);

  useEffect(() => {
    if (serverFailed) {
      router.navigate("/serviceDown");
    } else {
      router.navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverFailed]);

  return <></>;
}

export default Globals;
