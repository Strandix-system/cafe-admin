import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Grid, Box, FormLabel } from "@mui/material";
import { useEffect } from "react";
import Loader from "../common/Loader";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  Title,
  Restaurant,
  Description,
  Instagram,
  Facebook,
  Twitter,
} from "@mui/icons-material";
import InputField from "../common/InputField";
import ImageUploadSection from "../common/ImageUploadSection";
import { useImageUpload } from "../../utils/hooks/useImageUpload";
import { m } from "framer-motion";

const layoutSchema = yup.object({
  layoutTitle: yup.string().required("Layout title is required"),
  homeImage: yup
    .mixed()
    .test("required", "Home image is required", (value) => {
      return value instanceof File || (typeof value === 'string' && value.trim() !== '');
    })
    .test("fileOrUrl", "Invalid image", (value) => {
      if (!value) return false;
      if (value instanceof File) return true;
      if (typeof value === 'string') return value.trim() !== '';
      return false;
    }),
  menuTitle: yup
    .string()
    .trim()
    .min(3, "Menu title must be at least 3 characters")
    .required("Menu title is required"),
  aboutImage: yup
    .mixed()
    .test("required", "About image is required", (value) => {
      return value instanceof File || (typeof value === 'string' && value.trim() !== '');
    })
    .test("fileOrUrl", "Invalid image", (value) => {
      if (!value) return false;
      if (value instanceof File) return true;
      if (typeof value === 'string') return value.trim() !== '';
      return false;
    }),
  aboutTitle: yup
    .string()
    .trim()
    .min(3, "About title is required")
    .required("About title is required"),
  aboutDescription: yup.string().required("About description is required"),
  cafeDescription: yup.string().required("Cafe description is required"),
  hours: yup.object({
    weekdays: yup.string().required("Weekdays hours required"),
    weekends: yup.string().required("Weekends hours required"),
  }),
  socialLinks: yup.object({
    instagram: yup.string().url("Invalid Instagram URL").required("Required"),
    facebook: yup.string().url("Invalid Facebook URL").required("Required"),
    twitter: yup.string().url("Invalid Twitter URL").required("Required"),
  }),
});

const TIME_PICKER_STYLES = {
  textField: {
    size: "small",
    sx: {
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        bgcolor: "#F5EFE6",
      },
    },
  },
};

export default function LayoutForm({
  defaultValues = {},
  onSubmit,
  isLoading = false,
  isSubmitting = false,
  isAdmin = false,
}) {
  const isEdit = Object?.entries(defaultValues)?.length > 0;
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm({
    resolver: yupResolver(layoutSchema),
    defaultValues: {
      layoutTitle: "",
      homeImage: null,
      menuTitle: "",
      aboutImage: null,
      aboutTitle: "",
      aboutDescription: "",
      cafeDescription: "",
      hours: {
        weekdays: "",
        weekends: "",
      },
      socialLinks: {
        instagram: "",
        facebook: "",
        twitter: "",
      },
    },
    mode: "all",
  });

  console.log("values", watch());

  // Use custom hook for image upload management
  const { previews, handleImageChange, handleReplaceImage, setPreview } =
    useImageUpload(setValue);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  useEffect(() => {
    if (isEdit) {
      reset(defaultValues);
      if (defaultValues.homeImage) {
        setPreview("homeImage", defaultValues.homeImage);
        setValue("homeImage", defaultValues.homeImage, { shouldValidate: true }); // ← Add this
      }
      if (defaultValues.aboutImage) {
        setPreview("aboutImage", defaultValues.aboutImage);
        setValue("aboutImage", defaultValues.aboutImage, { shouldValidate: true }); // ← Add this
      }
    }
  }, [defaultValues, reset, isEdit, setPreview, setValue]);

  const renderTimePickers = (field) => {
    const parts = field.value ? field.value.split(" - ") : [null, null];
    const openTime = parts[0]?.trim() || null;
    const closeTime = parts[1]?.trim() || null;

    const handleOpenChange = (newVal) => {
      if (newVal) {
        const formatted = `${dayjs(newVal).format("h:mm A")}${closeTime ? ` - ${closeTime}` : ""}`;
        field.onChange(formatted);
      }
    };

    const handleCloseChange = (newVal) => {
      if (newVal) {
        const formatted = `${openTime || ""} - ${dayjs(newVal).format("h:mm A")}`;
        field.onChange(formatted);
      }
    };

    return (
      <>
        <TimePicker
          label="Open"
          ampm={true}
          format="h:mm A"
          value={openTime ? dayjs(openTime, "h:mm A") : null}
          onChange={handleOpenChange}
          slotProps={TIME_PICKER_STYLES}
        />

        <TimePicker
          label="Close"
          ampm={true}
          format="h:mm A"
          value={closeTime ? dayjs(closeTime, "h:mm A") : null}
          onChange={handleCloseChange}
          slotProps={TIME_PICKER_STYLES}
        />
      </>
    );
  };

  // Replace renderTextField function
  const renderTextField = (
    name,
    label,
    icon,
    placeholder,
    multiline = false,
    gridSize = { xs: 12 },
    disabled = false,
  ) => (
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
            error={
              errors[name.split(".").reduce((obj, key) => obj?.[key], errors)]
            }
            helperText={
              disabled && name === "layoutTitle"
                ? "Title cannot be changed"
                : errors[name.split(".").reduce((obj, key) => obj?.[key], errors)]
                  ?.message
            }
            startIcon={icon}
            placeholder={placeholder}
            multiline={multiline}
            rows={multiline ? 4 : undefined}
            disabled={disabled}
          />
        )}
      />
    </Grid>
  );

  // Replace renderImageField function
  const renderImageField = (
    fieldName,
    label,
    inputId,
    gridSize = { xs: 12 },
  ) => (
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
        name={fieldName}
        control={control}
        render={({ field }) => (
          <>
            <ImageUploadSection
              label=""
              field={field}
              preview={previews[fieldName]}
              setPreview={(preview) => setPreview(fieldName, preview)}
              handleImageChange={(file) => handleImageChange(file, fieldName)}
              handleReplaceImage={() => handleReplaceImage(fieldName)}
              inputId={inputId}
              isEdit={isEdit}
            />
            {errors[fieldName] && (
              <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
                {errors[fieldName]?.message}
              </Box>
            )}
          </>
        )}
      />
    </Grid>
  );

  // Replace renderTimeField function
  const renderTimeField = (name, label, gridSize = { xs: 12 }) => (
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
          <>
            <div className="flex gap-4 mt-2">{renderTimePickers(field)}</div>
            {errors.hours?.[name.split(".")[1]] && (
              <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
                {errors.hours[name.split(".")[1]].message}
              </Box>
            )}
          </>
        )}
      />
    </Grid>
  );

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Loader variant="spinner" />
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="px-10 py-6">
      {/* ===== HEADER ===== */}
      <div className="flex gap-3 items-center justify-between w-full mb-6">
        <h2 className="text-2xl font-bold">Customize Layout</h2>

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || !isValid || isSubmitting}
          sx={{
            bgcolor: "#6F4E37",
            "&:hover": { bgcolor: "#5A3D2B" },
          }}
        >
          {isEdit && !isAdmin ? "Update Layout" : "Create Layout"}
        </Button>
      </div>
      <Grid container spacing={3}>
        {/* ROW 1: Two Images Side by Side */}
        {renderImageField("homeImage", "Home Image", "home-image-upload", {
          xs: 12,
          md: 6,
        })}
        {renderImageField("aboutImage", "About Image", "about-image-upload", {
          xs: 12,
          md: 6,
        })}

        {/* ROW 2: Layout Title & Menu Title */}
        {renderTextField(
          "layoutTitle",
          "Layout Title",
          <Title sx={{ color: "#6F4E37" }} />,
          "Enter layout title",
          false,
          { xs: 12, md: 6 },
          isAdmin,
        )}
        {renderTextField(
          "menuTitle",
          "Menu Title",
          <Restaurant sx={{ color: "#6F4E37" }} />,
          "Enter menu title",
          false,
          { xs: 12, md: 6 },
        )}

        {/* ROW 3: About Title */}
        {renderTextField(
          "aboutTitle",
          "About Title",
          <Title sx={{ color: "#6F4E37" }} />,
          "Enter about title",
        )}

        {/* ROW 4: Descriptions */}
        {renderTextField(
          "aboutDescription",
          "About Description",
          <Description sx={{ color: "#6F4E37" }} />,
          "Enter about description",
          true,
          { xs: 12, md: 6 },
        )}
        {renderTextField(
          "cafeDescription",
          "Cafe Description",
          <Description sx={{ color: "#6F4E37" }} />,
          "Enter cafe description",
          true,
          { xs: 12, md: 6 },
        )}

        {/* Hours */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {renderTimeField("hours.weekdays", "Weekdays Hours", {
            xs: 12,
            md: 6,
          })}
          {renderTimeField("hours.weekends", "Weekends Hours", {
            xs: 12,
            md: 6,
          })}
        </LocalizationProvider>

        {/* Social Links */}
        {renderTextField(
          "socialLinks.instagram",
          "Instagram Link",
          <Instagram sx={{ color: "#6F4E37" }} />,
          "https://instagram.com/yourcafe",
          false,
          { xs: 12, md: 4 },
        )}
        {renderTextField(
          "socialLinks.facebook",
          "Facebook Link",
          <Facebook sx={{ color: "#6F4E37" }} />,
          "https://facebook.com/yourcafe",
          false,
          { xs: 12, md: 4 },
        )}
        {renderTextField(
          "socialLinks.twitter",
          "Twitter Link",
          <Twitter sx={{ color: "#6F4E37" }} />,
          "https://twitter.com/yourcafe",
          false,
          { xs: 12, md: 4 },
        )}
      </Grid>
    </form>
  );
}
