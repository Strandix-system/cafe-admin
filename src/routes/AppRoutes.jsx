import { Routes, Route, Navigate } from "react-router-dom";

import ForgotPassword from "../pages/ForgotPassword";
import Login  from "../pages/Login";
import Dashboard from "../pages/dashboard/Dashboard";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path = "/" element = {<Login/>} />
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route path="/forgot-password" element={<ForgotPassword/>}/>
    </Routes>
  );
};

export default AppRoutes;
