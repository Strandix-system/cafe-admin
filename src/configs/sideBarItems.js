import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import CategoryIcon from "@mui/icons-material/Category";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import ViewListIcon from "@mui/icons-material/ViewList";
import Restaurant from "@mui/icons-material/Restaurant";
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
            icon: ViewListIcon,
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
            icon: MenuBookIcon,
            path: "/menu",
            tab: "menu",
        },
        {
            key: "customerData",
            label: "Customer Management",
            icon: SupervisedUserCircleIcon,
            path: "/customer",
            tab: "customer-data",
        },
        {
            key: "categories",
            label: " QR Management",
            key: "OrderManagement",
            label: "Order Management",
            icon: Restaurant,
            path: "/order-management",
            tab: "order-management",
        },
        {
            key: "qr-code",
            label: "Generate QR-Code",
            icon: QrCode,
            path: "/table-management",
            tab: "table-management",
        },
    ],
};
