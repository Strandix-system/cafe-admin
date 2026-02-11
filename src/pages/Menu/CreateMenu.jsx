// import React, { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { APIRequest } from "../../utils/api_request";
// import { useNavigate } from "react-router-dom";
// export default function CreateMenu() {
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm();

//   const navigate = useNavigate(); 
//   const [preview, setPreview] = useState(null);

//   const categories = [
  
//     {
//          id: "69831350b0cdd7f248d87f97",
//          name: "Beverages",
//     }
//   ];

// const onSubmit = async (data) => {
//   try {
//     console.log("Form Data:", data);

//     const formData = new FormData();

//     formData.append("name", data.itemName);
//     formData.append("description", data.description);
//     formData.append("price", data.price);
//     formData.append("category", data.categoryId);
//     formData.append("image", data.image[0]);
//     formData.append(
//   "discountPrice",
//   data.discountPrice
//     ? Number(data.discountPrice)
//     : 0
// );

//     // 🔥 API CALL
//     const response = await APIRequest.post("menu/create", formData);

//     console.log("API Response:", response);

//     alert("Menu Created Successfully ✅");

//   } catch (error) {
//     console.error("Error:", error);
//     alert(error);
//   }

//   console.error("Error:", error);
//      alert(error?.message || "Something went wrong");

// };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//       <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        
//         {/* Title */}
//         <h2 className="text-2xl font-bold mb-6 text-gray-800">
//           Create Menu Item
//         </h2>
        
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

//           {/* Item Name */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Item Name
//             </label>
//             <input
//               type="text"
//               {...register("itemName", { required: "Item name is required" })}
//               className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//               placeholder="Enter item name"
//             />
//             {errors.itemName && (
//               <p className="text-red-500 text-sm">
//                 {errors.itemName.message}
//               </p>
//             )}
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Description
//             </label>
//             <textarea
//               {...register("description")}
//               className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//               placeholder="Enter description"
//             />
//           </div>

//           {/* Price */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Price
//             </label>
//             <input
//               type="number"
//               {...register("price", { required: "Price is required" })}
//               className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//               placeholder="Enter price"
//             />
//             {errors.price && (
//               <p className="text-red-500 text-sm">
//                 {errors.price.message}
//               </p>
//             )}
//           </div>

//           {/* Category Dropdown */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Category
//             </label>

//             <Controller
//               name="categoryId"
//               control={control}
//               rules={{ required: "Category is required" }}
//               render={({ field }) => (
//                 <select
//                   {...field}
//                   className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((cat) => (
//                     <option key={cat.id} value={cat.id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             />

//             {errors.categoryId && (
//               <p className="text-red-500 text-sm">
//                 {errors.categoryId.message}
//               </p>
//             )}
//           </div>

//           {/* Image Upload */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Item Image
//             </label>

//             <input
//               type="file"
//               accept="image/*"
//               {...register("image", {
//                 required: "Image is required",
//                 onChange: (e) => {
//                   const file = e.target.files[0];
//                   if (file) {
//                     setPreview(URL.createObjectURL(file));
//                   }
//                 },
//               })}
//               className="w-full"
//             />

//             {errors.image && (
//               <p className="text-red-500 text-sm">
//                 {errors.image.message}
//               </p>
//             )}

//             {/* Preview */}
//             {preview && (
//               <img
//                 src={preview}
//                 alt="Preview"
//                 className="mt-3 w-32 h-32 object-cover rounded-lg border"
//               />
//             )}
//           </div>

//           {/* Submit Button */}
//           <div className="pt-4">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { MenuItem, FormLabel } from "@mui/material";

// import InputField from "../../components/InputField";
import { APIRequest } from "../../utils/api_request";
import InputField from "../../components/common/InputField";

export default function CreateMenu() {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  // Dummy category (later from API)
  const categories = [
    {
      id: "69831350b0cdd7f248d87f97",
      name: "Beverages",
    },
  ];

  // 🔥 SUBMIT
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.itemName);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("category", data.categoryId);
      formData.append("image", data.image[0]);
      formData.append(
        "discountPrice",
        data.discountPrice ? Number(data.discountPrice) : 0
      );

      const response = await APIRequest.post(
        "menu/create",
        formData
      );

      alert("Menu Created Successfully ✅");
      navigate("/menu-list");

    } catch (error) {
      console.error(error);
      alert(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">

        <h2 className="text-2xl font-bold mb-6">
          Create Menu Item
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* ITEM NAME */}
          <FormLabel>Item Name</FormLabel>
          <Controller
            name="itemName"
            control={control}
            rules={{ required: "Item name is required" }}
            render={({ field }) => (
              <InputField
                field={field}
                error={errors.itemName}
                helperText={errors.itemName?.message}
                placeholder="Enter item name"
              />
            )}
          />

          {/* DESCRIPTION */}
          <FormLabel sx={{ mt: 2 }}>
            Description
          </FormLabel>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description required" }}
            render={({ field }) => (
              <InputField
                field={field}
                error={errors.description}
                helperText={errors.description?.message}
                multiline
                rows={3}
                placeholder="Enter description"
              />
            )}
          />

          {/* PRICE */}
          <FormLabel sx={{ mt: 2 }}>
            Price
          </FormLabel>
          <Controller
            name="price"
            control={control}
            rules={{
              required: "Price is required",
              min: {
                value: 1,
                message: "Price must be > 0",
              },
            }}
            render={({ field }) => (
              <InputField
                field={field}
                type="number"
                error={errors.price}
                helperText={errors.price?.message}
                placeholder="Enter price"
              />
            )}
          />

          {/* DISCOUNT PRICE */}
          <FormLabel sx={{ mt: 2 }}>
            Discount Price
          </FormLabel>
          <Controller
            name="discountPrice"
            control={control}
            render={({ field }) => (
              <InputField
                field={field}
                type="number"
                placeholder="Enter discount price"
              />
            )}
          />

          {/* CATEGORY */}
          <FormLabel sx={{ mt: 2 }}>
            Category
          </FormLabel>
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <InputField
                field={field}
                select
                error={errors.categoryId}
                helperText={errors.categoryId?.message}
              >
                <MenuItem value="">
                  Select Category
                </MenuItem>

                {categories.map((cat) => (
                  <MenuItem
                    key={cat.id}
                    value={cat.id}
                  >
                    {cat.name}
                  </MenuItem>
                ))}
              </InputField>
            )}
          />

          {/* IMAGE */}
          <FormLabel sx={{ mt: 2 }}>
            Item Image
          </FormLabel>

          <input
            type="file"
            accept="image/*"
            {...register("image", {
              required: "Image is required",
              onChange: (e) => {
                const file = e.target.files[0];
                if (file) {
                  setPreview(
                    URL.createObjectURL(file)
                  );
                }
              },
            })}
          />

          {errors.image && (
            <p className="text-red-500 text-sm">
              {errors.image.message}
            </p>
          )}

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded-lg border"
            />
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Submit
          </button>

        </form>
      </div>
    </div>
  );
}
