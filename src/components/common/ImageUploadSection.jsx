import { Box, Avatar, IconButton, FormLabel } from "@mui/material";
import { PhotoCamera, Close } from "@mui/icons-material";

const ImageUploadSection = ({
  label,
  field,
  preview,
  setPreview,
  handleImageChange,
  handleRemoveImage,
  inputId,
}) => {
  return (
    <>
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

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={preview || field?.value}
            sx={{
              width: 100,
              height: 100,
              bgcolor: "#F5EFE6",
              border: "3px dashed #6F4E37",
              cursor: "pointer",
            }}
            onClick={() => document.getElementById(inputId).click()}
          >
            {!preview && !field.value && (
              <PhotoCamera sx={{ fontSize: 40, color: "#6F4E37" }} />
            )}
          </Avatar>

          {(preview || field.value) && (
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                bgcolor: "#fff",
                boxShadow: 1,
              }}
              onClick={() => handleRemoveImage(field, setPreview)}
            >
              <Close fontSize="small" />
            </IconButton>
          )}
        </Box>

        <input
          id={inputId}
          type="file"
          hidden
          accept="image/*"
          onChange={(e) =>
            handleImageChange(e.target.files[0], field, setPreview)
          }
        />

        {!preview && !field.value && (
          <Box sx={{ color: "#6F4E37", fontSize: "0.875rem" }}>
            Click to upload
          </Box>
        )}
      </Box>
    </>
  );
};

export default ImageUploadSection;
