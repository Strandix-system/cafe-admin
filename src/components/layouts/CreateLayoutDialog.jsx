import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Grid
} from "@mui/material";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { layoutSchema } from "../../validations/layoutSchema";
import { usePost } from "../../utils/hooks/api_hooks";
import { queryClient } from "../../lib/queryClient";
import { API_ROUTES } from "../../utils/api_constants";

export default function CreateLayoutDialog({ open, onClose }) {
  const { mutate: createLayout, isLoading } = usePost(API_ROUTES.createLayout, {
    onSuccess: () => {
      toast.success("Layout added successfully ☕✨");
      reset(); // ✅ reset react-hook-form properly
      onClose();
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to add layout");
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(layoutSchema),
    defaultValues: {
      title: "",
      description: "",
      imageCount: 0,
      // images: [],
    },
  });

  const imageCount = watch("imageCount");

  const onSubmit = (data) => {
    const count = Number(imageCount);

    if (count > 0 && data.images?.length !== count) {
      toast.error(`Please upload exactly ${count} images`);
      return;
    }

    const formData = new FormData();

    // 🔥 MATCH BACKEND FIELD NAMES
    formData.append("cafeTitleLabel", data.title.trim());
    formData.append("descriptionLabel", data.description.trim());
    formData.append("noOfImage", count);

    if (count > 0) {
      Array.from(data.images).forEach((img) =>
        formData.append("image", img)
      );
    }

    console.log("FORM DATA:");
    for (let [k, v] of formData.entries()) {
      console.log(k, v);
    }

    createLayout(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Layout</DialogTitle>

      <DialogContent>
        <form onSubmit={(e) => {
          e.preventDefault();
          console.log("FORM SUBMIT EVENT TRIGGERED");
          handleSubmit(onSubmit)(e);
        }}>
          <Grid container spacing={2} mt={1}>
            {/* Title */}
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            {/* Image Count */}
            <Grid item xs={12}>
              <Controller
                name="imageCount"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Number of Images"
                    fullWidth
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    inputProps={{ min: 0 }}
                  />
                )}
              />
            </Grid>

            {/* Image Upload */}
            {imageCount > 0 && (
              <Grid item xs={12}>
                <Controller
                  name="images"
                  control={control}
                  render={({ field }) => (
                    <Button component="label" fullWidth variant="outlined">
                      Upload {imageCount} Images
                      <input
                        hidden
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </Button>
                  )}
                />
              </Grid>
            )
            }

            {/* Submit */}
            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Layout"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
}
