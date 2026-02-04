import * as yup from "yup";

export const AdminSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("First name is required"),

  lastName: yup
    .string()
    .trim()
    .required("Last name is required"),

  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
      "Password must contain uppercase, lowercase, number & special character"
    )
    .required("Password is required"),

  cafeName: yup
    .string()
    .trim()
    .required("Cafe name is required"),

  phoneNumber: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),

  address: yup
    .string()
    .trim()
    .required("Address is required"),

  city: yup
    .string()
    .trim()
    .required("City is required"),

  state: yup
    .string()
    .trim()
    .required("State is required"),

  pincode: yup
    .string()
    .matches(/^\d{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),

  logo: yup
    .mixed()
    .required("Cafe logo is required")
    .test(
      "fileType",
      "Only image files are allowed",
      (value) => value && value.type?.startsWith("image/")
    ),

  profileImage: yup
    .mixed()
    .required("Profile image is required")
    .test(
      "fileType",
      "Only image files are allowed",
      (value) => value && value.type?.startsWith("image/")
    ),
});
