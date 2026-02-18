import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";

import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import LayoutsPage from "../pages/LayoutsPage";

import AdminList from "../pages/AdminList";
import CategoriesList from "../pages/CategoriesList";

import ProtectedRoutes from "./ProtectedRoutes";
import AddEditAdmin from "../pages/addEditAdmin/AddEditAdmin";
import AddEditLayout from "../pages/addEditLayout/AddEditLayout";
import MenuList from "../pages/Menu/MenuList";
import CustomerList from "../pages/customer-list/CustomerList";
import OrderManagementPage from "../pages/OrderManagementPage";
import OrderHistoryList from "../pages/OrderHistoryList";
import CafeTableManagement from "../pages/CafeTableManagement";
import MyOrders from "../pages/dashboard/MyOrders";
import Profile from "../pages/profile/profile";

const AppRoutes = () => {
    return (
        <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

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
                <Route path="/profile" element={<Profile />} />
                <Route path="/my-orders/:userId" element={<MyOrders />} />
            </Route>

            {/* CATCH ALL */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
