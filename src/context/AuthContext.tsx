import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

interface ChildProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: ChildProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore session on refresh
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        if (res.status === 200) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password }, { withCredentials: true });
      if (res.status === 200) {
        // after login, fetch user profile
        const me = await api.get("/auth/me", { withCredentials: true });
        setUser(me.data.user);
      }
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
