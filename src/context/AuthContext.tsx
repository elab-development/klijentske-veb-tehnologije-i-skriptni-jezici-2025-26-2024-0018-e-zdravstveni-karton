import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { User } from "../models/User";
import { currentUser, login as loginService, logout as logoutService, register as registerService } from "../services/auth";
import type { UserRole } from "../types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (params: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = currentUser();
    setUser(u);
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await loginService(email, password);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(
    async (params: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      role: UserRole;
    }) => {
      const u = await registerService(params);
      setUser(u);
      return u;
    },
    [],
  );

  const logout = useCallback(() => {
    logoutService();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
