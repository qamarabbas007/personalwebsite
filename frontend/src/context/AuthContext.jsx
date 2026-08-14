import { createContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser } from "../services/authApi";

export const AuthContext = createContext(null);

const STORAGE_KEY = "qa_auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const persist = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    persist(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await registerUser({ name, email, password });
    persist(data);
    return data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // ignore network errors on logout
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
