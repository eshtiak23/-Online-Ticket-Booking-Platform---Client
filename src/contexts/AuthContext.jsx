import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  const login = async (email, password) => {
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) throw error;
    return data;
  };

  const register = async (name, email, password) => {
    const { data, error } = await authClient.signUp.email({ name, email, password });
    if (error) throw error;
    return data;
  };

  const loginWithGoogle = async () => {
    const { data, error } = await authClient.signIn.social({ provider: "google" });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await authClient.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isPending, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
