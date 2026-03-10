import { TextField, InputAdornment, Autocomplete } from "@mui/material";

export const InputField = ({
  field,
  error,
  helperText,
  startIcon,
  endIcon,
  disabled = false,
  isAutocomplete = false, // 🔥 NEW
  options = [], // 🔥 NEW
  getOptionLabel,
  onOptionChange,
  sx = {},
  ...props
}) => {
  if (isAutocomplete) {
    return (
      <Autocomplete
        options={options}
        getOptionLabel={getOptionLabel}
        value={options.find((opt) => opt._id === field.value) || null}
        onChange={(_, newValue) => {
          onOptionChange?.(newValue);
        }}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            size="small"
            placeholder={props.placeholder}
            error={!!error}
            helperText={helperText}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#F5EFE6",
                "&:hover": { bgcolor: "#EFE5D8" },
              },
              ...sx,
            }}
          />
        )}
      />
    );
  }
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
        endAdornment: endIcon ? ( // Add this
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : null,
      }}
      {...props}
    />
  );
};
