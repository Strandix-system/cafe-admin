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
import { usePost } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { queryClient } from "../../lib/queryClient";
import { useEffect , useState } from "react";

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
        await APIRequest.patch(
          `${API_ROUTES.updateCategory}/${category._id}`,
          { name: data.name }
        );
        toast.success("Category updated successfully ✅");
      } else {
        await APIRequest.post(API_ROUTES.createCategory, {
          name: data.name,
        });
        toast.success("Category created successfully ✅");
      }

      await queryClient.refetchQueries({
        queryKey: ["get-categories"],
        type: "active",
      });

      reset();
      handleClose();
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
        <Button onClick={handleClose} variant="outlined" sx={{color:"#6F4E37"}}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={loading || !isValid}
          sx={{backgroundColor:"#6F4E37"}}
        >
          {loading
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
            ? "Update"
            : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCategoryDialog;
