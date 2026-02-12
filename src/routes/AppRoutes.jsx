import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";

import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import LayoutsPage from "../pages/LayoutsPage";
// import CreateLayoutPage from "../pages/CreateLayoutPage";
import AdminList from "../pages/AdminList";
import CategoriesList from "../pages/CategoriesList";

import ProtectedRoutes from "./ProtectedRoutes";
import AddEditAdmin from "../pages/addEditAdmin/AddEditAdmin";
import AddEditLayout from "../pages/addEditLayout/AddEditLayout";
import CreateMenu from "../pages/Menu/CreateMenu";
import MenuList from "../pages/Menu/MenuList";
import OrderManagementPage from "../pages/OrderManagementPage";
import OrderHistoryList from "../pages/OrderHistoryList";
// import { MenuList } from "@mui/material";
import CafeTableManagement from "../pages/CafeTableManagement";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* PROTECTED ROUTES - Dashboard Stats/Overview */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />

      {/* PROTECTED ROUTES - Admin Management (Super Admin Only) */}
      <Route
        path="/cafes"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <AdminList />
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/cafe/create-edit/:userId?"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <AddEditAdmin />
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />

      {/* PROTECTED ROUTES - Layouts Management */}
      <Route
        path="/layouts"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <LayoutsPage />
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/layouts/create-edit/:layoutId?"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <AddEditLayout />
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />

      {/* PROTECTED ROUTES - Categories Management */}
      <Route
        path="/categories"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <CategoriesList />
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />
      <Route
        path="/table-management"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <CafeTableManagement />
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/menu"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <CreateMenu />
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/ordermanagement"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <OrderManagementPage />
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/order-history"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <OrderHistoryList />
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />

      {/* CATCH ALL - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
