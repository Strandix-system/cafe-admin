// import React, { createContext, useContext, useState } from "react";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );

//   const login = (userData, rememberMe) => {
//     setUser(userData);

//     if (rememberMe) {
//       localStorage.setItem("user", JSON.stringify(userData));
//       localStorage.setItem("token", userData.token);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.clear();
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import * as React from "react";
import { useEffect, useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useFetch } from "../utils/hooks/api_hooks";
import { API_ROUTES } from "../utils/api_constants";
import { api_enums } from "../enums/api";

const AuthContext = React.createContext();

// TODO setup login with me API
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
  },[userData])

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
        role: user?.role,
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