import { useContext } from "react";
import { AuthContext, type AuthContextType } from "../auth/AuthProvider";

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
