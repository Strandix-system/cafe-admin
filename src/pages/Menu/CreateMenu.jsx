import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FormLabel, MenuItem } from "@mui/material";
import { toast } from "react-hot-toast";
import { APIRequest } from "../../utils/api_request";
import InputField from "../../components/common/InputField";
import { API_ROUTES } from "../../utils/api_constants";
import { queryClient } from "../../lib/queryClient";
import { useFetch } from "../../utils/hooks/api_hooks";

export default function CreateMenu() {
  const { menuId } = useParams();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      itemName: "",
      description: "",
      price: "",
      discountPrice: "",
      category: "",
    },
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);

  const { data: { result: { results: categoriesData } } = {} } = useFetch("get-categories", API_ROUTES.getCategories, {}, {
    enabled: true
  });

  // 🔹 FETCH CATEGORIES
  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (!menuId) return;

    const fetchMenu = async () => {
      try {
        setPageLoading(true);
        const res = await APIRequest.get(`${API_ROUTES.getMenuById}/${menuId}`);

        reset({
          itemName: res.result.name,
          description: res.result.description,
          price: res.result.price,
          discountPrice: res.result.discountPrice,
          category: res.result.categoryId,
        });

        setPreview(res.result.image);
      } catch (error) {
        toast.error("Failed to fetch menu details");
      } finally {
        setPageLoading(false);
      }
    };

    fetchMenu();
  }, [menuId, reset]);

  useEffect(() => {
    queryClient.refetchQueries({
      queryKey: ["menu-list"],
    });
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", data.itemName);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("discountPrice", data.discountPrice);

      const selectedCategory = categories.find(
        (cat) => cat._id === data.category
      );

      formData.append("category", selectedCategory.name);

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }
      // formData.append("image", data.image[0]);

      if (menuId) {
        await APIRequest.patch(`${API_ROUTES.updateMenu}/${menuId}`, formData);
        toast.success("Menu updated successfully ✅");
      } else {
        await APIRequest.post(API_ROUTES.createMenu, formData);
        toast.success("Menu created successfully ✅");
      }

      await queryClient.refetchQueries({ queryKey: ["menu-list"], type: "active" });

      navigate("/menu");

    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  // if (pageLoading) return <Loader variant="spinner" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
          🍽️{menuId ? "Edit Menu Item" : "Create Menu Item"}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* ITEM NAME */}
          <div>
            <FormLabel>Item Name</FormLabel>
            <Controller
              name="itemName"
              control={control}
              rules={{ required: "Item name is required" }}
              render={({ field }) => (
                <InputField
                  field={field}
                  placeholder="Chocolate Brownie"
                  error={errors.itemName}
                  helperText={errors.itemName?.message}
                />
              )}
            />
          </div>

          {/* CATEGORY */}
          <div>
            <FormLabel>Category</FormLabel>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <InputField
                  field={field}
                  select
                  error={errors.category}
                  helperText={errors.category?.message}
                >
                  <MenuItem value="">Select Category</MenuItem>
                  {categories?.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                  ))
                  }
                </InputField>
              )}
            />
          </div>

          {/* PRICE */}
          <div>
            <FormLabel>Price</FormLabel>
            <Controller
              name="price"
              control={control}
              rules={{
                required: "Price is required",
                min: { value: 1, message: "Price must be greater than 0" },
              }}
              render={({ field }) => (
                <InputField
                  field={field}
                  type="number"
                  placeholder="₹ 120"
                  error={errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />
          </div>

          {/* DISCOUNT PRICE */}
          <div>
            <FormLabel>Discount Price</FormLabel>
            <Controller
              name="discountPrice"
              control={control}
              render={({ field }) => (
                <InputField
                  field={field}
                  type="number"
                  placeholder="₹ 99"
                />
              )}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <FormLabel>Description</FormLabel>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <InputField
                  field={field}
                  multiline
                  rows={4}
                  placeholder="Write a short description..."
                  error={errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div className="md:col-span-2">
            <FormLabel>Item Image</FormLabel>

            <label className="flex items-center justify-center h-16 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <span className="text-gray-500">
                Click to upload image
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register("image", {
                  required: !menuId ? "Image is required" : false,
                  onChange: (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPreview(URL.createObjectURL(file));
                    }
                  },
                })}
              />
            </label>

            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* IMAGE PREVIEW */}
          {preview && (
            <div className="md:col-span-2 flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-xl shadow-md border"
              />
            </div>
          )}

          {/* SUBMIT */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-10 py-3 rounded-xl text-lg font-medium text-white transition
                ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading
                ? "Saving..."
                : menuId
                  ? "Update Menu Item"
                  : "Create Menu Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
