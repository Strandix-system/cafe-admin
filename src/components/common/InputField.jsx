import { TextField, InputAdornment } from "@mui/material";

export const InputField = ({
  field,
  error,
  helperText,
  startIcon,
  endIcon,
  disabled = false,
  ...props
}) => {
  return (
    <TextField
      {...field}
      fullWidth
      size="small"
      disabled={disabled}
      error={!!error}
      helperText={helperText}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          bgcolor: "#F5EFE6",
          "&:hover": { bgcolor: "#EFE5D8" },
        },
      }}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : null,
        endAdornment: endIcon ? (  // Add this
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : null,
      }}
      {...props}
    />
  );
};


