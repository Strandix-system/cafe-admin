import * as yup from "yup";

export const loginSchema = yup.object({
  name:yup.string(),
  phoneNumber: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number"),
});