// import { APIRequest } from "../utils/api_request";
// // import { api_constants } from "../utils/api_constants.js";

// const API_URL = "http://localhost:3001";

// export const getAdmins = () => {
//   return axios.get(`${API_URL}/admins`);
// };

// export const addAdmin = (data) => {
//   return axios.post(`${API_URL}/admins`, data);
// };

// export const updateAdmin = (id, data) => {
//   return axios.put(`${API_URL}/admins/${id}`, data);
// };

// export const deleteAdmin = (id) => {
//   return axios.delete(`${API_URL}/admins/${id}`);
// };

// export const createAdmin = async (payload) => {
//   const res = await APIRequest({
//     url: api_constants.CREATE_ADMIN,
//     method: "POST",
//     data: payload,
//   });
//   return res.data;
// };



import { APIRequest } from "../utils/api_request";
import { API_ROUTES } from "../utils/api_constants";

export const getAdmins = () => {
  return APIRequest.get(API_ROUTES.GET_ADMINS);
};

export const addAdmin = (data) => {
  return APIRequest.post(API_ROUTES.CREATE_ADMIN, data);
};

export const updateAdmin = (id, data) => {
  return APIRequest.put(API_ROUTES.UPDATE_ADMIN(id), data);
};

export const deleteAdmin = (id) => {
  return APIRequest.remove(API_ROUTES.DELETE_ADMIN(id));
};

export const createAdmin = async (payload) => {

  const res = await APIRequest.post(API_ROUTES.CREATE_ADMIN,payload)
  return res;
};
