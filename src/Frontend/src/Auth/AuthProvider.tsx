import { GoogleOAuthProvider } from "@react-oauth/google";
import { createContext } from "react";
import { useAuth } from "./useAuth";

const authContext = createContext({});

export function AuthProvider(args: { children?: any; clientId: string }) {
  const auth = useAuth();

  return (
    <authContext.Provider value={auth}>
      <GoogleOAuthProvider clientId={args.clientId}>{args.children}</GoogleOAuthProvider>
    </authContext.Provider>
  );
}
