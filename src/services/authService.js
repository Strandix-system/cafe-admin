import axiosInstance from "./axiosInstance";

/*
export const loginUser = async (data) => {
  const response = await axiosInstance.post(
    "/auth/login",
    data
  );
  console.log("Successful");
  return response.data;
};
*/
export const loginUser = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/login", data);
    console.log("LOGIN API RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.log("LOGIN API ERROR:", error.response);
    throw error;
  }
};
