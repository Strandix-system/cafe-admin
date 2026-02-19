import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { APIRequest } from "../../utils/api_request";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import toast from "react-hot-toast";
import { usePatch, usePost } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { queryClient } from "../../lib/queryClient";
import { useEffect, useState } from "react";
import CommonButton from "../../components/common/CommonButton";

// ✅ Yup Schema
const schema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Too long")
    .required("Category name is required"),
});

const CreateCategoryDialog = ({ open, handleClose, category }) => {

  const isEdit = Boolean(category);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  const { mutate: createCategory, isPending: createPending } = usePost(API_ROUTES.createCategory, {
    onSuccess: () => {
      toast.success("Category created successfully ✅");
      queryClient.invalidateQueries({ queryKey: ["get-categories"], type: "all" });
      reset();
      handleClose();
    },
    onError: (error) => {
      console.error("Create category failed:", error);
      toast.error(error?.message || "Failed to create category");
    }
  });

  const { mutate: updateCategory, isPending: updatePending } = usePatch(`${API_ROUTES.updateCategory}/${category?._id}`, {
    onSuccess: () => {
      toast.success("Category updated successfully ✅");
      queryClient.invalidateQueries({ queryKey: ["get-categories"] });
      reset();
      handleClose();
    },
    onError: (error) => {
      console.error("Update category failed:", error);
      toast.error(error?.message || "Failed to update category");
    }
  }
  );

  useEffect(() => {
    if (category) {
      reset({ name: category.name });
    } else {
      reset({ name: "" });
    }
  }, [category, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (isEdit) {
        updateCategory({ name: data.name });
      } else {
        createCategory({ name: data.name });
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Update Category" : "Create New Category"}</DialogTitle>

      <DialogContent>
        <Box mt={1}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Category Name"
                placeholder="Enter category name"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        {/* <Button onClick={handleClose} variant="outlined" sx={{ color: "#6F4E37" }}>
          Cancel
        </Button> */}
        <CommonButton variant="outlined" onClick={handleClose}>
          Cancel
        </CommonButton>

        {/* <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={createPending || updatePending || !isValid}
          sx={{ backgroundColor: "#6F4E37" }}
        >
          {createPending || updatePending
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
              ? "Update"
              : "Create"}
        </Button> */}
        <CommonButton variant="contained" onClick={handleSubmit(onSubmit)} loading={createPending || updatePending} disabled={!isValid}>
          {isEdit ? "Update" : "Create"}
        </CommonButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCategoryDialog;
