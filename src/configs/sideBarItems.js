import BarChartIcon from "@mui/icons-material/BarChart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";

export const sideBarItems = {
  superAdmin: [
    { key: "stats", label: "Statistics", icon: BarChartIcon, tab: "stats" },
    { key: "admins", label: "Admin Management", icon: AdminPanelSettingsIcon, tab: "admins" },
  ],
  admin: [
    { key: "dashboard", label: "Dashboard", icon: DashboardIcon , tab: "dashboard" },
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
