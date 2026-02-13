import * as yup from "yup";

export const adminSchema = yup.object().shape({
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: yup.string().when("$isEdit", {
    is: false,
    then: (schema) =>
      schema
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
          "Password must contain uppercase, lowercase, number & special character"
        )
        .required("Password is required"),
    otherwise: (schema) =>
      schema.notRequired().optional(),
  }),
  cafeName: yup.string().trim().required("Cafe name is required"),
  phoneNumber: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
  address: yup.string().trim().required("Address is required"),
  city: yup.string().trim().required("City is required"),
  state: yup.string().trim().required("State is required"),
  pincode: yup
    .string()
    .matches(/^\d{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),
  gst: yup.number().required("GST percentage is required").min(5, "GST must be at least 5%").max(28, "GST cannot exceed 28%"),
  logo: yup
    .mixed()
    .test("required", "Cafe logo is required", (value) => {
      return value instanceof File || (typeof value === "string" && value.trim() !== "");
    })
    .test("fileOrUrl", "Invalid image", (value) => {
      if (!value) return false;
      if (value instanceof File) return true;
      if (typeof value === "string") return value.trim() !== "";
      return false;
    }),
  profileImage: yup
    .mixed()
    .test("required", "Profile image is required", (value) => {
      return value instanceof File || (typeof value === "string" && value.trim() !== "");
    })
    .test("fileOrUrl", "Invalid image", (value) => {
      if (!value) return false;
      if (value instanceof File) return true;
      if (typeof value === "string") return value.trim() !== "";
      return false;
    }),
});
