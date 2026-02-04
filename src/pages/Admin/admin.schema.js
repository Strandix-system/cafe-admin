// admin.schema.js
import * as yup from "yup";

export const AdminSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
  cafeName: yup.string().required("Cafe name is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Phone number is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  pincode: yup.string().required("Pincode is required"),
  logo: yup.mixed().required("Logo is required"),
  profileImage: yup.mixed().required("Profile image is required"),
});
