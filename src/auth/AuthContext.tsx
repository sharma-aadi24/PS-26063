// src/auth/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Role = "public" | "student" | "researcher" | "content_manager" | "admin";

export interface User {
  name: string;
  role: Role;
}

interface AuthContextProps {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: Role) => {
    // In demo mode we just set a static user
    setUser({ name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`, role });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
