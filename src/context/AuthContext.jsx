import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api_enums } from "../enums/api";
import { useFetch } from "../utils/hooks/api_hooks";
import { API_ROUTES } from "../utils/api_constants";
import { AUTH_ROLES } from "../utils/constant";
import Loader from "../components/common/Loader";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const token = localStorage.getItem(api_enums.JWT_ACCESS_TOKEN);

  const { refetch } = useFetch(
    "get-me",
    API_ROUTES.getMe,
    {},
    { enabled: !!token },
  );

  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const res = await refetch();
          if (res?.data?.result) {
            setUser(res.data.result);
            setIsAuthenticated(true);
            navigate("/dashboard");
          } else {
            logout();
          }
        } catch (error) {
          console.error(error);
          logout();
        }
      }
      setAuthLoading(false);
    };
    init();
  }, [token, refetch]);

  const logout = useCallback(() => {
    localStorage.removeItem(api_enums.JWT_ACCESS_TOKEN);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const login = useCallback(
    async (token) => {
      localStorage.setItem(api_enums.JWT_ACCESS_TOKEN, token);
      setAuthLoading(true);

      try {
        const res = await refetch();
        if (res?.data?.result) {
          setUser(res.data.result);
          setIsAuthenticated(true);
          navigate("/dashboard");
        } else {
          logout();
        }
      } catch (error) {
        console.error(error);
        logout();
      } finally {
        setAuthLoading(false);
      }
    },
    [logout],
  );

  const refreshUser = useCallback(async () => {
    try {
      const res = await refetch();
      if (res?.data?.result) {
        setUser(res.data.result);
      }
    } catch (error) {
      console.error(error);
    }
  }, [refetch]);

  // Add this helper above the return
  const isProfileComplete = (userData) => {
    if (!userData) return false;
    const required = [
      userData.firstName,
      userData.lastName,
      userData.phoneNumber,
      userData.address,
      userData.city,
      userData.state,
      userData.pincode,
      userData.cafeName,
      userData.gst,
      userData.logo,
      userData.profileImage,
      userData.hours?.weekdays?.open,
      userData.hours?.weekdays?.close,
      userData.hours?.weekends?.open,
      userData.hours?.weekends?.close,
    ];
    return required.every((val) => val !== null && val !== undefined && val !== "");
  };

  if (authLoading) return <><Loader variant="fullscreen" /></>;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin: user?.role === AUTH_ROLES.ADMIN,
        isSuperAdmin: user?.role === AUTH_ROLES.SUPER_ADMIN,
        isProfileComplete: isProfileComplete(user),
        login,
        logout,
        refreshUser,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
