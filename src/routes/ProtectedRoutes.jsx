import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CompleteProfileDialog from "../pages/Profile/CompleteProfileDialog";

export const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      //Used CompleteProfileDialog in protected routes so the dialog
      // is visible throughout the application until the condition are met to close the dialog 
      <CompleteProfileDialog />
      {children}
    </>
  );
};


