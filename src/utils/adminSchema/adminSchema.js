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
    otherwise: (schema) => schema.notRequired().optional(),
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
  gst: yup
    .number()
    .required("GST percentage is required")
    .min(5, "GST must be at least 5%")
    .max(28, "GST cannot exceed 28%"),
  logo: yup
    .mixed()
    .test("required", "Cafe logo is required", (value) => {
      return (
        value instanceof File ||
        (typeof value === "string" && value.trim() !== "")
      );
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
      return (
        value instanceof File ||
        (typeof value === "string" && value.trim() !== "")
      );
    })
    .test("fileOrUrl", "Invalid image", (value) => {
      if (!value) return false;
      if (value instanceof File) return true;
      if (typeof value === "string") return value.trim() !== "";
      return false;
    }),
  hours: yup.object().shape({
    weekdays: yup
      .object()
      .shape({
        open: yup
          .string()
          .nullable()
          .required("Weekday opening time is required"),
        close: yup
          .string()
          .nullable()
          .required("Weekday closing time is required")
          .test(
            "is-after-open",
            "Closing time must be after opening time",
            function (closeTime) {
              const { open } = this.parent;
              if (!open || !closeTime) return true;

              const openDate = new Date(open);
              const closeDate = new Date(closeTime);

              return closeDate > openDate;
            }
          ),
      })
      .required("Weekday hours are required"),
    weekends: yup
      .object()
      .shape({
        open: yup
          .string()
          .nullable()
          .required("Weekend opening time is required"),
        close: yup
          .string()
          .nullable()
          .required("Weekend closing time is required")
          .test(
            "is-after-open",
            "Closing time must be after opening time",
            function (closeTime) {
              const { open } = this.parent;
              if (!open || !closeTime) return true;

              const openDate = new Date(open);
              const closeDate = new Date(closeTime);

              return closeDate > openDate;
            }
          ),
      })
      .required("Weekend hours are required"),
  }),
  socialLinks: yup.object().shape({
    instagram: yup
      .string()
      .trim()
      .url("Enter a valid URL")
      .matches(
        /^https?:\/\/(www\.)?instagram\.com\/.+/,
        "Enter a valid Instagram URL"
      )
      .nullable()
      .notRequired(),
    facebook: yup
      .string()
      .trim()
      .url("Enter a valid URL")
      .matches(
        /^https?:\/\/(www\.)?facebook\.com\/.+/,
        "Enter a valid Facebook URL"
      )
      .nullable()
      .notRequired(),
    twitter: yup
      .string()
      .trim()
      .url("Enter a valid URL")
      .matches(
        /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/,
        "Enter a valid Twitter/X URL"
      )
      .nullable()
      .notRequired(),
  }),
});