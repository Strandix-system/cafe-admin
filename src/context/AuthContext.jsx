import * as React from "react";
import { useEffect, useState } from "react";
import { useFetch } from "../utils/hooks/api_hooks";
import { API_ROUTES } from "../utils/api_constants";
import { api_enums } from "../enums/api";
import { AUTH_ROLES } from "../utils/constant";

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  const {data: userData , isLoading, isError } = useFetch('get-me', API_ROUTES.getMe, {}, {
    enabled: !!localStorage.getItem(api_enums.JWT_ACCESS_TOKEN)
  });
  
  useEffect(()=>{
    if(userData?.result){
      setIsAuthenticated(true);
      setUser(userData?.result);
    }
  },[userData]);

  useEffect(()=>{
    if(isError){
      logout();
    }
  }, [isError])

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(api_enums.JWT_ACCESS_TOKEN);
  };
  
  return isLoading ? (
    <>Loading...</>
  ) : (
    <AuthContext.Provider value={{
        user,
        isAdmin: user?.role === AUTH_ROLES.ADMIN,
        isSuperAdmin: user?.role === AUTH_ROLES.SUPER_ADMIN,
        isAuthenticated,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };