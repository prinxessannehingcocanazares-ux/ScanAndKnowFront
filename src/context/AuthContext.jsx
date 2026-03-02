import { createContext, useContext, useState } from "react";

// Mock user (example)
const mockUser = {
  id: 1,
  name: "Demo User",
  email: "demo@user.com",
  role: "user",
};

// Create Context
export const AuthContext = createContext(null);

// Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, role) => {
    const newUser = { ...mockUser, email, role };
    setUser(newUser);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);

    const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}