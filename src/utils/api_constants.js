export const API_ROUTES = {
    login: "auth/login",
    getMe: "auth/me",
    getUsers: "/admin/get-users",

    getUserById: (_id) => `admin/get-user/${_id}`,
    updateUsers: (_id) => `admin/update/${_id}`,
    
    delete: "/admin/delete",
    superAdminStats: "/admin/get-users",
    getLayouts: "layout/",
    createLayout: "layout/create",

    getCategories: "",

}