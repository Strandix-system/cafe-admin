import { Grid, FormLabel, Box } from "@mui/material";
import { Controller } from "react-hook-form";
import { ImageUploadSection } from "./ImageUploadSection";
import toast from "react-hot-toast";

export const CommonImageField = ({
  name,
  label,
  inputId,
  control,
  errors,
  /* preview handling */
  preview,
  setPreview,

  /* layout */
  gridSize = { xs: 12 },

  /* edit mode */
  isEdit = false,
}) => {
  const error = errors?.[name];

  return (
    <Grid size={gridSize}>
      {label && (
        <FormLabel
          sx={{
            color: "#6F4E37",
            fontWeight: 600,
            mb: 1,
            display: "block",
          }}
        >
          {label}
        </FormLabel>
      )}

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
                if (!file) return;

                const maxSize = 10 * 1024 * 1024; // 10MB
                if (file.size > maxSize) {
                  toast.error("Image size must be less than 10MB");
                  return;
                }
                field.onChange(file);
                setPreview?.(name, URL.createObjectURL(file));
              }}
              handleReplaceImage={() => {
                field.onChange(null);
                setPreview?.(name, null);
              }}
            />

            {error && (
              <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
                {error.message}
              </Box>
            )}
          </>
        )}
      />
    </Grid>
  );
};
