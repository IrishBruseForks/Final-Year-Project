import axios from "axios";
import { OAuth, OAuthResponse } from "../Types/ServerTypes";
import Constants from "../Utility/Constants";
import { useLocalStorage } from "../Utility/useLocalstorage";

export function useAuth() {
  const [user, setUser] = useLocalStorage<OAuthResponse | undefined>(Constants.UserKey, undefined);

  return {
    user,
    async login(token: OAuth) {
      const resp = await axios.post(import.meta.env.VITE_API_URL + "auth/google", { code: token.code });
      setUser(resp.data as OAuthResponse);
    },
    logout() {
      setUser(undefined);
      window.location.reload();
    },
  };
}
