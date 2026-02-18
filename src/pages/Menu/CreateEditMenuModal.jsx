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

export default function CreateEditMenuModal({ open, onClose, menuId }) {
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

  const renderTextField = (
    name,
    label,
    placeholder,
    gridSize = { xs: 12 },
    multiline = false,
    type = "text"
  ) => (
    <Grid size={gridSize}>
      <FormLabel sx={{ fontWeight: 600, mb: 1, display: "block" }}>
        {label}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputField
            field={field}
            placeholder={placeholder}
            type={type}
            multiline={multiline}
            rows={multiline ? 3 : undefined}
            error={errors[name]}
            helperText={errors[name]?.message}
          />
        )}
      />
    </Grid>
  );

  const renderImageField = (name, label, inputId) => (
    <Grid size={{ xs: 12 }}>
      <FormLabel sx={{ fontWeight: 600, mb: 1, display: "block" }}>
        {label}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <ImageUploadSection
              label=""
              field={field}
              preview={preview}
              setPreview={setPreview}
              inputId={inputId}
              isEdit={isEdit}
              handleImageChange={(file) => {
                field.onChange(file);
                setPreview(URL.createObjectURL(file));
              }}
              handleReplaceImage={() => {
                field.onChange(null);
                setPreview(null);
              }}
            />
            {errors[name] && (
              <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
                {errors[name]?.message}
              </Box>
            )}
          </>
        )}
      />
    </Grid>
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        🍽️ {isEdit ? "Edit Menu Item" : "Create Menu Item"}
      </DialogTitle>

      <DialogContent dividers>
        <form id="menu-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {renderTextField(
              "itemName",
              "Item Name",
              "Enter item name",
              { xs: 12, md: 6 }
            )}

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

            {renderTextField(
              "price",
              "Price",
              "Enter price",
              { xs: 12, md: 6 },
              false,
              "number"
            )}

            {renderTextField(
              "discountPrice",
              "Discount Price",
              "Optional",
              { xs: 12, md: 6 },
              false,
              "number"
            )}

            {renderTextField(
              "description",
              "Description",
              "Enter description",
              { xs: 12 },
              true
            )}

            {renderImageField("image", "Item Image", "menu-image-upload")}
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} sx={{ color: "#6F4E37" }}>Cancel</Button>
        <Button
          type="submit"
          form="menu-form"
          variant="contained"
           sx={{ backgroundColor: "#6F4E37" }}
          disabled={!isValid || loading}
        >
          {loading ? "Saving..." : isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
