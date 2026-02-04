import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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

// ✅ Yup Schema
const schema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Too long")
    .required("Category name is required"),
});

const CreateCategoryDialog = ({ open, handleClose }) => {
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
  });

  const { mutate: createCategory, isLoading } = usePost(
    API_ROUTES.createCategory,
    {
      onSuccess: () => {
        toast.success("Category created successfully");
        queryClient.invalidateQueries({ queryKey: ["get-categories"] });
        reset();
        handleClose();
      },
      onError: (error) => {
        toast.error(error || "Failed to create category");
      },
    }
  );

  const onSubmit = (data) => {
    createCategory({ name: data.name });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Category</DialogTitle>

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
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading || !isValid}
        >
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCategoryDialog;
