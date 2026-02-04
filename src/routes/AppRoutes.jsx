import { Routes, Route, Navigate } from "react-router-dom";

import ForgotPassword from "../pages/ForgotPassword";
import Login  from "../pages/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import LayoutsPage from "../pages/LayoutsPage";
import CreateLayoutPage from "../pages/CreateLayoutPage";
import CreateAdmin from "../pages/createAdmin/CreateAdmin";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path = "/" element = {<Login/>} />
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/layouts" element={<LayoutsPage />} />
      <Route path="/layouts/create" element={<CreateLayoutPage />} />
      <Route path="/admin/create" element={<CreateAdmin />} />
    </Routes>
  );
};

export default AppRoutes;
