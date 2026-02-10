import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import CategoryIcon from "@mui/icons-material/Category";
import Restaurant from "@mui/icons-material/Restaurant";

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
      key: "OrderManagement",
      label: "Order Management",
      icon: Restaurant,
      path: "/ordermanagement",
      tab: "ordermanagement",
    },
  ],
};
