import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { CompleteProfileDialog } from "../pages/Profile/CompleteProfileDialog";

export const ProtectedRoutes = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return (
        <>
            {/* <CompleteProfileDialog /> */}
            {children}
        </>
    );
};


