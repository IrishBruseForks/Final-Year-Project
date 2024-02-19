import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export function GuardedRoute(args: { component: JSX.Element }) {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }

  if (user.signup) {
    // user was signing up
    return <Navigate to="/signup" />;
  }

  return args.component;
}
