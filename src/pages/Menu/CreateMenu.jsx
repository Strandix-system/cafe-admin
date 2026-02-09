import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { APIRequest } from "../../utils/api_request";
import { useNavigate } from "react-router-dom";
export default function CreateMenu() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate(); 
  const [preview, setPreview] = useState(null);

  const categories = [
  
    {
         id: "69831350b0cdd7f248d87f97",
         name: "Beverages",
    }
  ];

const onSubmit = async (data) => {
  try {
    console.log("Form Data:", data);

    const formData = new FormData();

    formData.append("name", data.itemName);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.categoryId);
    formData.append("image", data.image[0]);
    formData.append(
  "discountPrice",
  data.discountPrice
    ? Number(data.discountPrice)
    : 0
);

    // 🔥 API CALL
    const response = await APIRequest.post("menu/create", formData);

    console.log("API Response:", response);

    alert("Menu Created Successfully ✅");

  } catch (error) {
    console.error("Error:", error);
    alert(error);
  }

  console.error("Error:", error);
     alert(error?.message || "Something went wrong");

};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        
        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create Menu Item
        </h2>
        
 <button
    type="button"
    onClick={() => navigate("/menu-list")}
    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
  >
    Menu List
  </button>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Item Name
            </label>
            <input
              type="text"
              {...register("itemName", { required: "Item name is required" })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter item name"
            />
            {errors.itemName && (
              <p className="text-red-500 text-sm">
                {errors.itemName.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter description"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Price
            </label>
            <input
              type="number"
              {...register("price", { required: "Price is required" })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter price"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category
            </label>

            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            />

            {errors.categoryId && (
              <p className="text-red-500 text-sm">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Item Image
            </label>

            <input
              type="file"
              accept="image/*"
              {...register("image", {
                required: "Image is required",
                onChange: (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                },
              })}
              className="w-full"
            />

            {errors.image && (
              <p className="text-red-500 text-sm">
                {errors.image.message}
              </p>
            )}

            {/* Preview */}
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 w-32 h-32 object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
