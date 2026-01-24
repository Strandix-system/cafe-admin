import { APIRequest } from "../utils/api_request";
import { API_ROUTES } from "../utils/api_constants";

export const fetchSuperAdminStats = () => {
  return APIRequest.get(API_ROUTES.SUPERADMIN_DASHBOARD_STATS);
};
