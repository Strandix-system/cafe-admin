import { create, get, update } from "lodash";

export const API_ROUTES = {
    login: "auth/login",
    getMe: "auth/me",
    getUsers: "/admin/get-users",

    dashboardStats: "admin/dashboard/stats",

    getUserById: "admin/get-user",
    updateUsers: "admin/update",

    delete: "/admin/delete",
    getStats: "admin/dashboard/stats",

    createLayout: "layout/create",
    getLayouts: "layout/all-layouts",
    getLayoutById: "layout/get-layout",
    updateLayout: "layout/update",
    getLayoutByAdmin: "layout/admin-layout",
    setActiveLayout: "layout/update-status",

    getAllOrders: "order/get-all",
    updateOrder: "order/status",

    delete: "/admin/delete",
    superAdminStats: "/admin/get-users",
    createLayout: "layout/create",

    createAdmins: "admin/create",
    menulist: "menu/my-menus",
    user_list: "customer/get-all",
    createQRCodes: "qr/create",
    getQRCodes: "qr/get-all",
    getQRCount: "qr/count",

    createCategory: "category/create",
    getCategories: "category",
    getCategoryById: "category/get-by-id",
    updateCategory: "category/update",
    deleteCategory: "category/delete",
    getstates: "get-states",

    createAdmins: "admin/create",
    menulist: "menu/my-menus",
    user_list: "customer/get-all",
    deleteUser: "customer/delete",
    createQRCodes: "qr/create",
    getQRCodes: "qr/get-all",

    createMenu: "menu/create",
    getMenuById: "menu/get-by-id",
    MENU_DELETE: "menu/delete",
    updateMenu: "menu/update",
    getCustomers: "customer/get-all",
};
