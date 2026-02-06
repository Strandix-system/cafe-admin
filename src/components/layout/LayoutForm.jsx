import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  FormLabel,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
} from "mui-tiptap";
import { Close } from "@mui/icons-material";

const layoutSchema = yup.object({
  layoutTitle: yup.string().required("Layout title is required"),

  // homeImage: yup
  //   .mixed()
  //   .required("Home image is required")
  //   .test(
  //     "fileType",
  //     "Only image files allowed",
  //     (value) =>
  //       !value ||
  //       ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
  //         value.type
  //       )
  //   ),

  homeImage: yup.mixed().required("Home image is required"),

  menuTitle: yup
    .string()
    .trim()
    .min(3, "Menu title must be at least 3 characters")
    .required("Menu title is required"),

//  aboutImage: yup
//   .mixed()
//   .required("About image is required")
//   .test(
//     "fileType",
//     "Only image files allowed",
//     (value) =>
//       value &&
//       ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(value.type)
//   ),

  aboutImage: yup.mixed().required("About image is required"),

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

export default function LayoutForm({
  defaultValues ={},
  onSubmit,
  isLoading = false,
  isSubmitting = false,
}) {
  const isEdit = Object?.entries(defaultValues)?.length > 0;
  const { 
    control, 
    handleSubmit, 
    reset,
    setValue,
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

  const [homeImagePreview, setHomeImagePreview] = useState(null);
  const [aboutImagePreview, setAboutImagePreview] = useState(null);

  const [weekdayOpen, setWeekdayOpen] = useState(null);
  const [weekdayClose, setWeekdayClose] = useState(null);
  const [weekendOpen, setWeekendOpen] = useState(null);
  const [weekendClose, setWeekendClose] = useState(null);

  const handleFormSubmit = (data) => {
    const formattedData = {
      ...data,
      hours: {
        weekdays:
          weekdayOpen && weekdayClose
            ? `${dayjs(weekdayOpen).format("h:mm A")} - ${dayjs(
              weekdayClose
            ).format("h:mm A")}`
            : data.hours?.weekdays,

        weekends:
          weekendOpen && weekendClose
            ? `${dayjs(weekendOpen).format("h:mm A")} - ${dayjs(
              weekendClose
            ).format("h:mm A")}`
            : data.hours?.weekends,
      },
    };

    onSubmit(formattedData);
  };


  const handleImageChange = (file, field, setPreview) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setValue(field.name, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (field, setPreview) => {
    setPreview(null);
    field.onChange(null);
  };
  
  useEffect(() => {
    if (isEdit) {
      reset(defaultValues);
      if (defaultValues.aboutImage) {
        setAboutImagePreview(defaultValues.aboutImage);
      }
      if (defaultValues.homeImage) {
        setHomeImagePreview(defaultValues.homeImage);
      }
      if (defaultValues.hours?.weekdays) {
        const [open, close] = defaultValues.hours.weekdays.split(" - ");
        setWeekdayOpen(dayjs(open, "h:mm A"));
        setWeekdayClose(dayjs(close, "h:mm A"));
      }
      if (defaultValues.hours?.weekends) {
        const [open, close] = defaultValues.hours.weekends.split(" - ");
        setWeekendOpen(dayjs(open, "h:mm A"));
        setWeekendClose(dayjs(close, "h:mm A"));
      }

    }
}, [defaultValues, reset, isEdit]);

  if (isLoading)
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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="px-10 py-6">

      {/* ===== HEADER ===== */}
      <div className="flex gap-3 items-center justify-between w-full mb-6">
        
        <h2 className="text-2xl font-bold">
          {isEdit ? "Edit Layout" : "Create Layout"}
        </h2>

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || !isValid || isSubmitting}
        >
          {isEdit ? "Update Layout" : "Create Layout"}
        </Button>
      </div>

      <Grid container spacing={2}>

        {/* Layout Title */}
        <Grid size={{ xs: 12 }}>
          <FormLabel>Layout Title</FormLabel>
          <Controller
            name="layoutTitle"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                error={!!errors.layoutTitle}
                helperText={errors.layoutTitle?.message}
              />
            )}
          />
        </Grid>

        {/* Home Image */}
        <Grid size={{ xs: 12 }}>
          <FormLabel>Home Image</FormLabel>
          <Controller
            name="homeImage"
            control={control}
            render={({ field }) => (
              <div>
                {homeImagePreview && (
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(field, setHomeImagePreview)}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                )}
                <TextField
                  type="file"
                  fullWidth
                  inputProps={{ accept: "image/*" }}
                  onChange={(e) =>
                    handleImageChange(
                      e.target.files[0],   // selected file
                      field,               // react-hook-form field
                      setHomeImagePreview  // which preview to set
                    )
                  }
                  error={!!errors.homeImage}
                  helperText={errors.homeImage?.message}
                />
              </div>
            )}
          />
        </Grid>

        {/* Menu Title */}
        <Grid size={{ xs: 12 }}>
          <FormLabel>Menu Title</FormLabel>
          <Controller
            name="menuTitle"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                error={!!errors.menuTitle}
                helperText={errors.menuTitle?.message}
              />
            )}
          />
        </Grid>

        {/* About Image */}
        <Grid size={{ xs: 12 }}>
          <FormLabel>About Image</FormLabel>
          <Controller
            name="aboutImage"
            control={control}
            render={({ field }) => (
              <div>
                {aboutImagePreview && (
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(field, setAboutImagePreview)}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                )}
                <TextField
                  type="file"
                  fullWidth
                  inputProps={{ accept: "image/*" }}
                  onChange={(e) =>
                    handleImageChange(
                      e.target.files[0],
                      field,
                      setAboutImagePreview
                    )
                  }
                  error={!!errors.aboutImage}
                  helperText={errors.aboutImage?.message}
                />
              </div>
            )}
          />
        </Grid>

        {/* About Title */}
        <Grid size={{ xs: 12 }}>
          <FormLabel>About Title</FormLabel>
          <Controller
            name="aboutTitle"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                error={!!errors.aboutTitle}
                helperText={errors.aboutTitle?.message}
              />
            )}
          />
        </Grid>

        {/* About Description */}
        <Grid size={{ xs: 12 }}>
          <FormLabel>About Description</FormLabel>
          <Controller
            name="aboutDescription"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                error={!!errors.aboutDescription}
                helperText={errors.aboutDescription?.message}
              />

              // <RichTextEditor
              //   content={field.value}
              //   extensions={[StarterKit]}
              //   onUpdate={({ editor }) =>
              //     field.onChange(editor.getHTML())
              //   }
              //   renderControls={() => (
              //     <MenuControlsContainer>
              //       <MenuSelectHeading />
              //       <MenuDivider />
              //       <MenuButtonBold />
              //       <MenuButtonItalic />
              //     </MenuControlsContainer>
              //   )}
              // />
            )}
          />
        </Grid>

        {/* Cafe Description */}
        <Grid size={{ xs: 12 }}>
          <FormLabel>Cafe Description</FormLabel>
          <Controller
            name="cafeDescription"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                error={!!errors.cafeDescription}
                helperText={errors.cafeDescription?.message}
              />

              // <RichTextEditor
              //   content={field.value}
              //   extensions={[StarterKit]}
              //   onUpdate={({ editor }) =>
              //     field.onChange(editor.getHTML())
              //   }
              //   renderControls={() => (
              //     <MenuControlsContainer>
              //       <MenuSelectHeading />
              //       <MenuDivider />
              //       <MenuButtonBold />
              //       <MenuButtonItalic />
              //     </MenuControlsContainer>
              //   )}
              // />
            )}
          />
        </Grid>

        <LocalizationProvider dateAdapter={AdapterDayjs}>

          {/* ===== WEEKDAYS ===== */}
          <Grid size={{ xs: 12 }}>
            <FormLabel>Weekdays Hours</FormLabel>

            <div className="flex gap-4 mt-2">
              <Controller
                name="hours.weekdays"
                control={control}
                render={({ field }) => {
                  const [open, close] = field.value
                    ? field.value.split(" - ")
                    : [null, null];

                  return (
                    <>
                      <TimePicker
                        label="Open"
                        value={open ? dayjs(open, "h:mm A") : null}
                        onChange={(newVal) => {
                          const formatted =
                            newVal && close
                              ? `${dayjs(newVal).format("h:mm A")} - ${close}`
                              : field.value;
                          field.onChange(formatted);
                        }}
                        slotProps={{ textField: { size: "small" } }}
                      />

                      <TimePicker
                        label="Close"
                        value={close ? dayjs(close, "h:mm A") : null}
                        onChange={(newVal) => {
                          const formatted =
                            open && newVal
                              ? `${open} - ${dayjs(newVal).format("h:mm A")}`
                              : field.value;
                          field.onChange(formatted);
                        }}
                        slotProps={{ textField: { size: "small" } }}
                      />
                    </>
                  );
                }}
              />
            </div>

            {errors.hours?.weekdays && (
              <p style={{ color: "red", fontSize: 12 }}>
                {errors.hours.weekdays.message}
              </p>
            )}
          </Grid>

          {/* ===== WEEKENDS ===== */}
          <Grid size={{ xs: 12 }}>
            <FormLabel>Weekends Hours</FormLabel>

            <div className="flex gap-4 mt-2">
              <Controller
                name="hours.weekends"
                control={control}
                render={({ field }) => {
                  const [open, close] = field.value
                    ? field.value.split(" - ")
                    : [null, null];

                  return (
                    <>
                      <TimePicker
                        label="Open"
                        value={open ? dayjs(open, "h:mm A") : null}
                        onChange={(newVal) => {
                          const formatted =
                            newVal && close
                              ? `${dayjs(newVal).format("h:mm A")} - ${close}`
                              : field.value;
                          field.onChange(formatted);
                        }}
                        slotProps={{ textField: { size: "small" } }}
                      />

                      <TimePicker
                        label="Close"
                        value={close ? dayjs(close, "h:mm A") : null}
                        onChange={(newVal) => {
                          const formatted =
                            open && newVal
                              ? `${open} - ${dayjs(newVal).format("h:mm A")}`
                              : field.value;
                          field.onChange(formatted);
                        }}
                        slotProps={{ textField: { size: "small" } }}
                      />
                    </>
                  );
                }}
              />
            </div>

            {errors.hours?.weekends && (
              <p style={{ color: "red", fontSize: 12 }}>
                {errors.hours.weekends.message}
              </p>
            )}
          </Grid>

        </LocalizationProvider>



        {/* ====== SOCIAL LINKS ====== */}
        <Grid size={{ xs: 12 }}>
          <FormLabel>Instagram Link</FormLabel>
          <Controller
            name="socialLinks.instagram"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="https://instagram.com/yourcafe"
                error={!!errors.socialLinks?.instagram}
                helperText={errors.socialLinks?.instagram?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormLabel>Facebook Link</FormLabel>
          <Controller
            name="socialLinks.facebook"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="https://facebook.com/yourcafe"
                error={!!errors.socialLinks?.facebook}
                helperText={errors.socialLinks?.facebook?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormLabel>Twitter Link</FormLabel>
          <Controller
            name="socialLinks.twitter"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="https://twitter.com/yourcafe"
                error={!!errors.socialLinks?.twitter}
                helperText={errors.socialLinks?.twitter?.message}
              />
            )}
          />
        </Grid>

      </Grid>
    </form>
  );
}
