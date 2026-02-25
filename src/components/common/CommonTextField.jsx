import { Grid, FormLabel } from "@mui/material";
import { Controller } from "react-hook-form";
import InputField from "./InputField";

const getError = (errors, name) =>
  name.includes(".")
    ? name.split(".").reduce((obj, key) => obj?.[key], errors)
    : errors[name];

export const CommonTextField = ({
  name,
  label,
  icon,
  placeholder,
  disabled = false,
  gridSize = { xs: 12, sm: 6 },
  type = "text",

  /* ✅ NEW */
  multiline = false,
  rows = 4,

  control,
  errors,
}) => {
  const errorObj = getError(errors, name);

  return (
    <Grid size={gridSize}>
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

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputField
            field={field}
            error={!!errorObj}
            helperText={errorObj?.message}
            placeholder={placeholder}
            disabled={disabled}
            startIcon={icon}
            type={type}

            /* ✅ multiline support */
            multiline={multiline}
            rows={multiline ? rows : undefined}
          />
        )}
      />
    </Grid>
  );
};


