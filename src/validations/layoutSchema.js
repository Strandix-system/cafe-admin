import * as yup from "yup";

export const layoutSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  imageCount: yup
    .number()
    .typeError("Enter a number")
    .min(1)
    .max(10)
    .required(),
  // images: yup
  //   .mixed()
  //   .nullable()
  //   .test(
  //     "required",
  //     "Images are required",
  //     (value) => value && value.length > 0
  //   ),
});
