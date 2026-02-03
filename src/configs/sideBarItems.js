import BarChartIcon from "@mui/icons-material/BarChart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from "@mui/icons-material/Logout";
import { LayoutGrid } from "lucide-react";

export const sideBarItems = {
  superAdmin: [
    { key: "stats", label: "Statistics", icon: BarChartIcon, tab: "stats" },
    { key: "admins", label: "Admin Management", icon: AdminPanelSettingsIcon, tab: "admins" },
    { key: "layouts", label: "Layouts", icon: LayoutGrid, tab: "layouts"},
  ],
  admin: [
    { key: "dashboard", label: "Dashboard", icon: DashboardIcon , tab: "dashboard" },
    { key: "orders", label: "Orders", icon: ShoppingCartIcon, tab: "orders" },
    { key: "menu", label: "Menu", icon: MenuIcon, tab: "menu" },
    { key: "layouts", label: "Layouts", icon: LayoutGrid, tab: "layouts" },
    // add more admin tabs here
  ],
  common: [
    {
      key: "logout",
      label: "Logout",
      icon: LogoutIcon,
      type: "action", 
    },
  ],
};
