import { createContext, useContext, useMemo, useState, useEffect } from "react";

const AuthContext = createContext(null);

const DEFAULT_USER = {
  name: "Vinod Kumar V",
  email: "vinod@tp.ai",
  avatar: "/vkv.jpeg",
  role: "admin", // Default to admin for testing
};

export function AuthProvider({ children }) {
  // Load user from localStorage on mount
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("auth.user");
      return !!stored;
    }
    return true; // Default authenticated for demo
  });

  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("auth.user");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return DEFAULT_USER;
        }
      }
    }
    return DEFAULT_USER;
  });

  // Persist user to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isAuthenticated && user) {
        localStorage.setItem("auth.user", JSON.stringify(user));
      } else {
        localStorage.removeItem("auth.user");
      }
    }
  }, [isAuthenticated, user]);

  const login = (profile = DEFAULT_USER) => {
    const userProfile = {
      ...profile,
      role: profile.role || "user", // Default to user if no role specified
    };
    setUser(userProfile);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateRole = (newRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      logout,
      updateRole,
    }),
    [isAuthenticated, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}

