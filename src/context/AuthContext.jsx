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
import { getAccessToken } from "../utils/api_request";

const AuthContext = createContext();

export function AuthProvider({ children }) {
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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await APIRequest.get(API_ROUTES.getMe);

                if (response.success) {
                    setUser(response.result); // ✅ VERY IMPORTANT
                }
            } catch (error) {
                console.error("Failed to fetch user", error);
            }
        };

        if (getAccessToken()) {
            fetchUser();
        }
    }, []);


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

    if (authLoading) return <><Loader variant="fullscreen" /></>;

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isAdmin: user?.role === AUTH_ROLES.ADMIN,
                isSuperAdmin: user?.role === AUTH_ROLES.SUPER_ADMIN,
                login,
                logout,
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
