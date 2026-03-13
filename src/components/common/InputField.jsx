import {
  TextField,
  InputAdornment,
  Autocomplete,
  MenuItem,
} from "@mui/material";

export const InputField = ({
  field,
  error,
  helperText,
  startIcon,
  endIcon,
  disabled = false,
  isAutocomplete = false, // 🔥 NEW
  isSelect = false,
  options = [], // 🔥 NEW
  getOptionLabel,
  onOptionChange,
  sx = {},
  ...props
}) => {
  const commonTextFieldProps = {
    ...field,
    fullWidth: true,
    size: "small",
    disabled,
    error: !!error,
    helperText,
    sx: {
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        bgcolor: "#F5EFE6",
        "&:hover": { bgcolor: "#EFE5D8" },
      },
      ...sx,
    },
  };

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
            {...commonTextFieldProps}
            placeholder={props.placeholder}
          />
        )}
      />
    );
  }

  if (isSelect) {
    return (
      <TextField select {...commonTextFieldProps} {...props}>
        {options.map((option) => (
          <MenuItem key={option._id} value={option._id}>
            {option.name}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return (
    <TextField
      {...commonTextFieldProps}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : null,
        endAdornment: endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : null,
      }}
      {...props}
    />
  );
};
