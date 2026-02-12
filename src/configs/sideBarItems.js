import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import CategoryIcon from "@mui/icons-material/Category";
import { QrCode } from "lucide-react";

export const sideBarItems = {
  superAdmin: [
    {
      key: "stats",
      label: "Statistics",
      icon: DashboardIcon,
      path: "/dashboard",
      tab: "stats",
    },
    {
      key: "cafes",
      label: "Cafes",
      icon: PeopleIcon,
      path: "/cafes",
      tab: "cafes",
    },
    {
      key: "layouts",
      label: "Layouts",
      icon: ViewQuiltIcon,
      path: "/layouts",
      tab: "layouts",
    },
    {
      key: "categories",
      label: "Categories",
      icon: CategoryIcon,
      path: "/categories",
      tab: "categories",
    },
      
  ],
  admin: [
    {
      key: "stats",
      label: "Statistics",
      icon: DashboardIcon,
      path: "/dashboard",
      tab: "stats",
    },
    {
      key: "layouts",
      label: "Layouts",
      icon: ViewQuiltIcon,
      path: "/layouts",
      tab: "layouts",

    },

    {
      key: "Menu",
      label: "Menu",
      icon: CategoryIcon,
      path: "/menu",
      tab: "menu",
    },

    {
      key: "MenuList",
      label: "Menu List",
      icon: CategoryIcon,
      path: "/menulist",
      tab: "menulist",
    },
    {
      key: "categories",
      label: "Generate QR-Code",
      icon: QrCode,
      path: "/table-management",
      tab: "table-management",
    },
  ],
};
