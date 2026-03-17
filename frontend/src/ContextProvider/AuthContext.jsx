import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
    user: null,
    token: null,
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
    loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ email: null });
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Derived state for quick checking
  const isLoggedIn = !!token;

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    // 2. Set local state
    const userProfile = { email: userData.email };
    setUser(userProfile);
    setToken(token);

    // 3. Persist to localStorage
    localStorage.setItem("user", JSON.stringify(userProfile));
    localStorage.setItem("token", token);

    console.log("Context Updated: User logged in with token.");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
