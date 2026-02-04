import { Routes, Route, Navigate } from "react-router-dom";

import ForgotPassword from "../pages/ForgotPassword";
import Login  from "../pages/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import CreateAdmin from "../pages/Admin/CreateAdmin";
import ProfileView from "../pages/Profile/ProfileView";
import ProfileEdit from "../pages/Profile/ProfileEdit";
import ProfileBasicForm from "../pages/Profile/ProfileBasicForm";
// import AdminForm from "../components/forms/AdminForm";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path = "/" element = {<Login/>} />
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />
      <Route path="/dashboard/admins" element={<CreateAdmin/>} />
      <Route path="/dashboard/profile" element={<ProfileEdit/>} />
      <Route path="/dashboard/view" element={<ProfileView/>} />
      
      {/* <Route path="/dashboard/admins" element={<AdminForm/>} /> */}
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
    </Routes>
  );
};

export default AppRoutes;
