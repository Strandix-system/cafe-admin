import { Routes, Route, Navigate } from "react-router-dom";

import LoginSignup from "../pages/login/LoginSignup";
import ForgotPassword from "../pages/forgotPassword/ForgotPassword";

import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import LayoutsPage from "../pages/LayoutsPage";

import AdminList from "../pages/AdminList";
import CategoriesList from "../pages/CategoriesList";

import ProtectedRoutes from "./ProtectedRoutes";
import AddEditAdmin from "../pages/addEditAdmin/AddEditAdmin";
import AddEditLayout from "../pages/addEditLayout/AddEditLayout";
import MenuList from "../pages/Menu/MenuList";
import Plan from "../pages/login/Plan";
import CustomerList from "../pages/customer-list/CustomerList";
import OrderManagementPage from "../pages/OrderManagementPage";
import OrderHistoryList from "../pages/OrderHistoryList";
import CafeTableManagement from "../pages/CafeTableManagement";
import MyOrders from "../pages/dashboard/MyOrders";
import ProfileLayout from "../pages/Profile/ProfileLayout";
import ProfileUpdate from "../pages/Profile/ProfileUpdate";
import { ChangePassword } from "../pages/Profile/ChangePassword";
import ResetPassword from "../pages/forgotPassword/ResetPassword";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LoginSignup />} />
      <Route path="/plans" element={<Plan />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* PROTECTED ROUTES */}
      <Route
        element={
          <ProtectedRoutes>
            <DashboardLayout />
          </ProtectedRoutes>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cafes" element={<AdminList />} />
        <Route path="/cafe/create-edit/:userId?" element={<AddEditAdmin />} />
        <Route path="/cafes/:adminId?" element={<AdminList />} />
        <Route path="/layouts" element={<LayoutsPage />} />
        <Route path="/layouts/create-edit/:layoutId?" element={<AddEditLayout />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/table-management" element={<CafeTableManagement />} />
        <Route path="/menu" element={<MenuList />} />
        <Route path="/order-management" element={<OrderManagementPage />} />
        <Route path="/order-history" element={<OrderHistoryList />} />
        <Route path="/customer" element={<CustomerList />} />
        <Route path="/my-orders/:userId" element={<MyOrders />} />
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<ProfileUpdate />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Route>

      {/* CATCH ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
