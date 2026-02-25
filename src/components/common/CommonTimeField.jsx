import { Grid, FormLabel, Box } from "@mui/material";
import { Controller } from "react-hook-form";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const getNestedError = (errors, name) =>
  name?.split(".").reduce((obj, key) => obj?.[key], errors);

export const CommonTimeField = ({
  label,
  control,
  errors,
  gridSize = { xs: 12, md: 6 },

  /* OPTION 1: separate fields */
  openName,
  closeName,

  /* OPTION 2: single combined field */
  name,

  TIME_PICKER_STYLES,
}) => {
  /* ---------- MODE 1: OPEN / CLOSE FIELDS ---------- */
  if (openName && closeName) {
    const openError = getNestedError(errors, openName);
    const closeError = getNestedError(errors, closeName);

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

        <Box sx={{ display: "flex", gap: 2 }}>
          <Controller
            name={openName}
            control={control}
            render={({ field }) => (
              <TimePicker
                label="Open"
                value={field.value ? dayjs(field.value) : null}
                onChange={(val) =>
                  field.onChange(val ? val.toISOString() : null)
                }
                slotProps={{
                  ...TIME_PICKER_STYLES,
                  textField: {
                    ...TIME_PICKER_STYLES?.textField,
                    error: !!openError,
                    helperText: openError?.message,
                  },
                }}
              />
            )}
          />

          <Controller
            name={closeName}
            control={control}
            render={({ field }) => (
              <TimePicker
                label="Close"
                value={field.value ? dayjs(field.value) : null}
                onChange={(val) =>
                  field.onChange(val ? val.toISOString() : null)
                }
                slotProps={{
                  ...TIME_PICKER_STYLES,
                  textField: {
                    ...TIME_PICKER_STYLES?.textField,
                    error: !!closeError,
                    helperText: closeError?.message,
                  },
                }}
              />
            )}
          />
        </Box>
      </Grid>
    );
  }

  /* ---------- MODE 2: SINGLE STRING FIELD ---------- */
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
        render={({ field }) => {
          const parts = field.value?.split(" - ") || [];
          const openTime = parts[0] || null;
          const closeTime = parts[1] || null;

          return (
            <>
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <TimePicker
                  label="Open"
                  format="h:mm A"
                  value={openTime ? dayjs(openTime, "h:mm A") : null}
                  onChange={(val) => {
                    if (!val) return;
                    const formatted = `${dayjs(val).format("h:mm A")}${
                      closeTime ? ` - ${closeTime}` : ""
                    }`;
                    field.onChange(formatted);
                  }}
                  slotProps={TIME_PICKER_STYLES}
                />

                <TimePicker
                  label="Close"
                  format="h:mm A"
                  value={closeTime ? dayjs(closeTime, "h:mm A") : null}
                  onChange={(val) => {
                    if (!val) return;
                    const formatted = `${
                      openTime || ""
                    } - ${dayjs(val).format("h:mm A")}`;
                    field.onChange(formatted);
                  }}
                  slotProps={TIME_PICKER_STYLES}
                />
              </Box>

              {errors?.[name] && (
                <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
                  {errors[name]?.message}
                </Box>
              )}
            </>
          );
        }}
      />
    </Grid>
  );
};

