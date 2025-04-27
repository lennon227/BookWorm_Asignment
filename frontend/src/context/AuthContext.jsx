import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra xem có token trong localStorage không
    if (token && !user && !loading) {
      setLoading(true);
      fetch(`${import.meta.env.VITE_API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.id) {
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
          } else {
            logout();
          }
          setLoading(false);
        })
        .catch(() => {
          logout();
          setLoading(false);
        });
    }
  }, [token, user, loading]);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData)); // Lưu thông tin người dùng
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Xóa thông tin người dùng
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      token,
      user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;