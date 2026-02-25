import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  MenuItem,
  FormLabel,
  Box,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";

import { useFetch, usePost, usePatch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { queryClient } from "../../lib/queryClient";

import InputField from "../../components/common/InputField";
import ImageUploadSection from "../../components/common/ImageUploadSection";
import CommonTextField from "../../components/common/CommonTextField";
import CommonImageField from "../../components/common/CommonImageField";
import { useImageUpload } from "../../utils/hooks/useImageUpload";
import CommonButton from "../../components/common/commonButton";


const menuSchema = yup.object({
  itemName: yup.string().required("Item name is required"),
  category: yup.string().required("Category is required"),
  price: yup.number().typeError("Price is required").required(),
  discountPrice: yup.number().nullable(),
  description: yup.string().required("Description is required"),
  image: yup
    .mixed()
    .test("required", "Image is required", (value, ctx) => {
      if (ctx.options.context?.isEdit) return true;
      return value instanceof File || typeof value === "string";
    }),
});

export function CreateEditMenuModal({ open, onClose, menuId }) {
  const isEdit = Boolean(menuId);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(menuSchema, {
      context: { isEdit },
    }),
    defaultValues: {
      itemName: "",
      category: "",
      price: "",
      discountPrice: "",
      description: "",
      image: null,
    },
    mode: "all",
  });

  const [preview, setPreview] = useState(null);
  // const { previews, setPreview } = useImageUpload(setValue);


  const { data: { result: { results: categories = [] } = {} } = {}, } = useFetch("categories", API_ROUTES.getCategories);

  const { data: menuRes } = useFetch(
    ["menu-detail", menuId],
    `${API_ROUTES.getMenuById}/${menuId}`,
    {},
    { enabled: !!menuId && open }
  );

  useEffect(() => {
    if (!open) return;

    // ✅ CREATE MODE → FULL RESET
    if (!menuId) {
      reset({
        itemName: "",
        category: "",
        price: "",
        discountPrice: "",
        description: "",
        image: null,
      });
      setPreview(null);
    }
  }, [open, menuId, reset]);


  useEffect(() => {
    if (!menuRes?.result || !isEdit || !categories.length) return;

    console.log("🟡 MENU RESULT:", menuRes.result);

    reset({
      itemName: menuRes.result.name,
      category: menuRes.result.categoryId,
      price: menuRes.result.price,
      discountPrice: menuRes.result.discountPrice,
      description: menuRes.result.description,
      image: menuRes.result.image,
    });

    const matchedCategory = categories.find(
      (cat) => cat.name === menuRes.result.category
    );

    if (matchedCategory) {
      setValue("category", matchedCategory._id, {
        shouldValidate: true,
      });
    }

    setPreview(menuRes.result.image);
  }, [menuRes, isEdit, reset]);


  const createMenu = usePost(API_ROUTES.createMenu, {
    onSuccess: () => {
      toast.success("Menu created successfully ✅");
      queryClient.invalidateQueries({ queryKey: ["menu-list"] });
      handleClose();
    },
  });

  const updateMenu = usePatch(`${API_ROUTES.updateMenu}/${menuId}`, {
    onSuccess: () => {
      toast.success("Menu updated successfully ✅");
      queryClient.invalidateQueries({ queryKey: ["menu-list"] });
      handleClose();
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("name", data.itemName);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("discountPrice", data.discountPrice || "");

    const selectedCategory = categories.find(
      (c) => c._id === data.category
    );
    formData.append("category", selectedCategory?.name || "");

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    isEdit
      ? updateMenu.mutate(formData)
      : createMenu.mutate(formData);
  };

  const handleClose = () => {

    reset();
    setPreview(null);
    onClose();
  };

  const loading = createMenu.isPending || updateMenu.isPending;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        🍽️ {isEdit ? "Edit Menu Item" : "Create Menu Item"}
      </DialogTitle>

      <DialogContent dividers>
        <form id="menu-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <CommonTextField
              name="itemName"
              label="Item Name"
              placeholder="Enter item name"
              gridSize={{ xs: 12, md: 6 }}
              control={control}
              errors={errors}
            />

            <Grid size={{ xs: 12, md: 6 }}>
              <FormLabel sx={{ fontWeight: 600, mb: 1, display: "block" }}>
                Category
              </FormLabel>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <InputField
                    field={field}
                    select
                    error={errors.category}
                    helperText={errors.category?.message}
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </InputField>
                )}
              />
            </Grid>

            <CommonTextField
              name="price"
              label="Price"
              placeholder="Enter price"
              gridSize={{ xs: 12, md: 6 }}
              type="number"
              control={control}
              errors={errors}
            />

            <CommonTextField
              name="discountPrice"
              label="Discount Price"
              placeholder="Optional"
              gridSize={{ xs: 12, md: 6 }}
              type="number"
              control={control}
              errors={errors}
            />

            <CommonTextField
              name="description"
              label="Description"
              placeholder="Enter description"
              gridSize={{ xs: 12 }}
              multiline={true}
              control={control}
              errors={errors}
            />

            <CommonImageField
              name="image"
              label="Item Image"
              inputId="menu-image-upload"
              control={control}
              errors={errors}
              preview={preview}
              setPreview={setPreview}
              isEdit={isEdit}
              gridSize={{ xs: 12, sm: 6 }}
            />
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <CommonButton
          variant="outlined"
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </CommonButton>

        <CommonButton
          type="submit"
          form="menu-form"
          variant="contained"
          loading={loading}
          disabled={!isValid}
        >
          {isEdit ? "Update" : "Create"}
        </CommonButton>
      </DialogActions>
    </Dialog>
  );
}
