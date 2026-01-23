import { Navigate } from "react-router-dom";
import { api_enums } from "../enums/api";
import { useAuth } from "../context/AuthContext";

const ProtectedRoutes = ({children}) => {

    const token = localStorage.getItem(api_enums.JWT_ACCESS_TOKEN);
    
    const {isAuthenticated} = useAuth();
    if(!isAuthenticated){
        return <Navigate to="/login" replace/>
    }
    
};

export default ProtectedRoutes;