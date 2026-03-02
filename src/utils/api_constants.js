import { create, get, update } from "lodash";

export const API_ROUTES = {
    login: "auth/login",
    createOrder: "signup/create-order",
    verifySignup: "signup/verify-payment",
    getMe: "auth/me",
    getUsers: "/admin/get-users",

    dashboardStats: "admin/dashboard/stats",
    dashboardSales: "admin/dashboard/sales",
    dashboardItems: 'admin/dashboard/items-performance',
    dashboardPeakTime: "admin/dashboard/peak-time",
    dashboardTables: "admin/dashboard/tables",
    dashboardTopCustomers: "admin/dashboard/top-customers",
    dashboardTopCafes: "admin/dashboard/top-cafes",
    dashboardPlatformSales: "admin/dashboard/platform-sales",
    dashboardAdminAnalytics: "admin/dashboard/admin-analytics",

    getUserById: "admin/get-user",
    updateUsers: "admin/update",
    updateStatus: "admin/update-status",

    getStats: "admin/dashboard/stats",

    createLayout: "layout/create",
    getLayouts: "layout/all-layouts",
    getLayoutById: "layout/get-layout",
    updateLayout: "layout/update",
    getLayoutByAdmin: "layout/admin-layout",
    deleteLayoutbyAdmin: "layout/delete",
    setActiveLayout: "layout/update-status",

    getAllOrders: "order/get-all",
    getBillById: "order/bill",
    updateOrder: "order/status",
    updatePaymentStatus: "order/payment-status",

    deleteCafe: "/admin/delete",
    superAdminStats: "/admin/get-users",
    createLayout: "layout/create",

    createAdmins: "admin/create",
    menulist: "menu/my-menus",
    user_list: "customer/get-all",
    getQRCount: "qr/count",

    createCategory: "category/create",
    getCategories: "category",
    getUsedCategoriesDropdown: "category/used-categories-dropdown",
    getCategoryById: "category/get-by-id",
    updateCategory: "category/update",
    deleteCategory: "category/delete",
    getstates: "get-states",

    createAdmins: "admin/create",

    createQRCodes: "qr/create",
    getQRCodes: "qr/get-all",

    createMenu: "menu/create",
    getMenuById: "menu/get-by-id",
    MENU_DELETE: "menu/delete",
    updateMenu: "menu/update",
    menulist: "menu/my-menus",

    createCustomer: "customer/create",
    updateUser: "customer/update",
    getCustomers: "customer/get-all",
    myOrders: "order/my-orders",

    user_list: "customer/get-all",
    deleteUser: "customer/delete",

    forgotPassword: "auth/forgot-password",
    resetPassword: "auth/reset-password",
    changePassword: "auth/change-password",
};
