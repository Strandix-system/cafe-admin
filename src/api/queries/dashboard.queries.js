import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APIRequest } from "../../utils/api_request";

/* ================= SUPER ADMIN ================= */

// Fetch all cafe owners
export const useAdmins = (enabled) =>
  useQuery({
    queryKey: ["admins"],
    queryFn: () => APIRequest.get("superadmin/admins"),
    enabled,
  });

// Fetch selected admin analytics
export const useAdminAnalytics = (adminId, enabled) =>
  useQuery({
    queryKey: ["admin-analytics", adminId],
    queryFn: () =>
      APIRequest.get(`superadmin/admins/${adminId}/analytics`),
    enabled: !!adminId && enabled,
  });

// Delete admin
export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adminId) =>
      APIRequest.remove(`superadmin/admins/${adminId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admins"]);
    },
  });
};

/* ================= ADMIN ================= */

// Admin dashboard stats
export const useAdminStats = (enabled) =>
  useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => APIRequest.get("admin/dashboard/stats"),
    enabled,
  });

// Orders
export const useOrders = (enabled) =>
  useQuery({
    queryKey: ["orders"],
    queryFn: () => APIRequest.get("admin/orders"),
    enabled,
  });

// Menu
export const useMenu = (enabled) =>
  useQuery({
    queryKey: ["menu"],
    queryFn: () => APIRequest.get("admin/menu"),
    enabled,
  });

// Layouts
export const useLayouts = (enabled) =>
  useQuery({
    queryKey: ["layouts"],
    queryFn: () => APIRequest.get("admin/layouts"),
    enabled,
  });
