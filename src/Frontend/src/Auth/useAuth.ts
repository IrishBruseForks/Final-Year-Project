import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { OAuth, OAuthResponse } from "../Types/ServerTypes";
import Constants from "../Utility/Constants";
import Urls from "../Utility/Urls";
import { getApiAuthConfig } from "../Utility/useApi";
import { useLocalStorage } from "../Utility/useLocalstorage";

export function useAuth() {
  const { value: user, setValue } = useLocalStorage<OAuthResponse>(Constants.UserKey, undefined as any);
  const { setValue: setProfilePicture } = useLocalStorage<string>(Constants.ProfilePictureKey, undefined as any);

  return {
    user,
    async login(token: OAuth): Promise<OAuthResponse> {
      const resp = await axios.post<OAuthResponse>(import.meta.env.VITE_API_URL + Urls.Login, { code: token.code });
      setProfilePicture(resp.data.profilePicture!);
      setValue(resp.data as OAuthResponse);
      return resp.data;
    },
    async signup(username: string): Promise<void> {
      try {
        let resp = await axios.post<OAuthResponse>(import.meta.env.VITE_API_URL + Urls.Signup, { username: username }, getApiAuthConfig(user!));
        setProfilePicture(resp.data.profilePicture!);
        setValue({ ...resp.data, token: user.token });
      } catch (error) {
        enqueueSnackbar("Failed to signup: " + error, { variant: "error" });
      }
    },
    logout() {
      setValue(undefined as any);
      window.location.reload();
    },
  };
}
