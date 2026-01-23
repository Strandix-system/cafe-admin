import { useAuth } from "../../context/AuthContext";
import SuperAdminDashboard from "./SuperAdminDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
    const {role} = useAuth();
  const userRole = role?.toLowerCase(); // ✅ ADD
  const isSuperAdmin = userRole === "superadmin";
  const isAdmin = userRole === "admin";

  if (isSuperAdmin) {
    return <SuperAdminDashboard />;
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return <div>Unauthorized</div>;

};
