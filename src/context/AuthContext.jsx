import { createContext, useContext, useEffect, useState } from "react";
import { getUser, logoutAPI } from "../api/loginApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

 const checkAuth = async () => {
  setLoading(true);

  try {
    const data = await getUser();
    setUser(data);
    setIsAuthenticated(true);
    return data;
  } catch {
    setUser(null);
    setIsAuthenticated(false);
    return null;
  } finally {
    setLoading(false);
  }
};

const login = async () => {
  return await checkAuth(); 
};
 
const logout = async () => {
  try {
    await logoutAPI();
     sessionStorage.clear();
  setUser(null);
  setIsAuthenticated(false);
  } catch (err) {
    // console.log("logout error:", err);
  }
};

useEffect(() => {
    const timer = setTimeout(() => {
      checkAuth();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);