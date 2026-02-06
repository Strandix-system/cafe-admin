import { TextField, InputAdornment } from "@mui/material";

const InputField = ({
  field,
  error,
  helperText,
  startIcon,
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
      }}
      {...props}
    />
  );
};

export default InputField;
