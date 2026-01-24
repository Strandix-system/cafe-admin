import { apiRequest } from "../utils/api_request";
import { api_constants } from "../utils/api_constants.js";
const API_URL = "http://localhost:3001";

export const getAdmins = () => {
  return axios.get(`${API_URL}/admins`);
};

export const addAdmin = (data) => {
  return axios.post(`${API_URL}/admins`, data);
};

export const updateAdmin = (id, data) => {
  return axios.put(`${API_URL}/admins/${id}`, data);
};

export const deleteAdmin = (id) => {
  return axios.delete(`${API_URL}/admins/${id}`);
};

export const createAdmin = async (payload) => {
  const res = await apiRequest({
    url: api_constants.CREATE_ADMIN,
    method: "POST",
    data: payload,
  });
  return res.data;
};