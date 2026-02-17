import { yupResolver } from "@hookform/resolvers/yup";
import {
  Email,
  Visibility,
  VisibilityOff,
  Instagram,
  Facebook,
  Twitter,
} from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  TextField,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import {
  Building2,
  Contact,
  Lock,
  MapPin,
  UserRoundPlus,
  Users,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import Loader from "../common/Loader";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { adminSchema } from "../../utils/adminSchema/adminSchema";
import ImageUploadSection from "../common/ImageUploadSection";
import InputField from "../common/InputField";
import { useImageUpload } from "../../utils/hooks/useImageUpload";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { parseHoursFromBackend } from "../../utils/utils";

// Enable custom parse format plugin
dayjs.extend(customParseFormat);

const TIME_PICKER_STYLES = {
  textField: {
    size: "small",
    fullWidth: true,
    sx: {
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        bgcolor: "#F5EFE6",
        "&:hover": { bgcolor: "#EFE5D8" },
      },
    },
  },
};

export default function FormComponent({
  defaultValues = {},
  onSubmit,
  isLoading = false,
  isSubmitting = false,
}) {
  const isEdit = Object?.entries(defaultValues)?.length > 0;
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      cafeName: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      gst: "",
      logo: null,
      profileImage: null,
      hours: {
        weekdays: {
          open: null,
          close: null,
        },
        weekends: {
          open: null,
          close: null,
        },
      },
      socialLinks: {
        instagram: "",
        facebook: "",
        twitter: "",
      },
    },
    resolver: yupResolver(adminSchema),
    context: { isEdit },
    mode: "all",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { data: { data: statesData } = {} } = useFetch(
    "states",
    API_ROUTES.getstates,
  );

  const { previews, handleImageChange, handleReplaceImage, setPreview } =
    useImageUpload(setValue);

  const handleFormSubmit = (data) => {
    const { confirmPassword, ...rest } = data;
    onSubmit({
      ...rest,
      phoneNumber: Number(data.phoneNumber),
      gst: Number(data.gst),
    });
  };

  const handleRemoveImage = (fieldName) => {
    setValue(fieldName, null);
    setPreview(fieldName, null);
  };

  useEffect(() => {
    if (isEdit) {
      const transformedDefaults = {
        ...defaultValues,
        hours: {
          weekdays: parseHoursFromBackend(defaultValues.hours?.weekdays),
          weekends: parseHoursFromBackend(defaultValues.hours?.weekends),
        },
      };

      reset(transformedDefaults);
      // Set image previews from deployed URLs
      if (defaultValues.logo) {
        setPreview("logo", defaultValues.logo);
        setValue("logo", defaultValues.logo, { shouldValidate: true });
      }
      if (defaultValues.profileImage) {
        setPreview("profileImage", defaultValues.profileImage);
        setValue("profileImage", defaultValues.profileImage, {
          shouldValidate: true,
        });
      }
    }
  }, [defaultValues, reset, isEdit, setPreview, setValue]);

  // Render helper functions
  const renderTextField = (
    name,
    label,
    icon,
    placeholder,
    disabled = false,
    gridSize = { xs: 12, sm: 6 },
    type = "text",
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
              name.includes(".")
                ? name
                  .split(".")
                  .reduce((obj, key) => obj?.[key], errors)
                : errors[name]
            }
            helperText={
              name.includes(".")
                ? name
                  .split(".")
                  .reduce((obj, key) => obj?.[key], errors)?.message
                : errors[name]?.message
            }
            placeholder={placeholder}
            disabled={disabled}
            startIcon={icon}
            type={type}
          />
        )}
      />
    </Grid>
  );

  const renderImageField = (
    fieldName,
    label,
    inputId,
    gridSize = { xs: 12, sm: 6 },
  ) => (
    <Grid size={gridSize}>
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <ImageUploadSection
            label={label}
            field={field}
            preview={previews[fieldName]}
            setPreview={(preview) => setPreview(fieldName, preview)}
            handleImageChange={(file) => handleImageChange(file, fieldName)}
            handleRemoveImage={() => handleRemoveImage(fieldName)}
            handleReplaceImage={() => handleReplaceImage(fieldName)}
            inputId={inputId}
            isEdit={isEdit}
          />
        )}
      />
      {errors[fieldName] && (
        <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
          {errors[fieldName]?.message}
        </Box>
      )}
    </Grid>
  );

  const renderTimeField = (
    openName,
    closeName,
    label,
    gridSize = { xs: 12, md: 6 },
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
      <Box sx={{ display: "flex", gap: 2 }}>
        <Controller
          name={openName}
          control={control}
          render={({ field }) => (
            <TimePicker
              {...field}
              label="Open"
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) => {
                field.onChange(newValue ? newValue.toISOString() : null);
              }}
              slotProps={{
                ...TIME_PICKER_STYLES,
                textField: {
                  ...TIME_PICKER_STYLES.textField,
                  error: !!openName
                    .split(".")
                    .reduce((obj, key) => obj?.[key], errors),
                  helperText: openName
                    .split(".")
                    .reduce((obj, key) => obj?.[key], errors)?.message,
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
              {...field}
              label="Close"
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) => {
                field.onChange(newValue ? newValue.toISOString() : null);
              }}
              slotProps={{
                ...TIME_PICKER_STYLES,
                textField: {
                  ...TIME_PICKER_STYLES.textField,
                  error: !!closeName
                    .split(".")
                    .reduce((obj, key) => obj?.[key], errors),
                  helperText: closeName
                    .split(".")
                    .reduce((obj, key) => obj?.[key], errors)?.message,
                },
              }}
            />
          )}
        />
      </Box>
    </Grid>
  );

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
    <Box sx={{ width: "100%", height: "100%", bgcolor: "#FAF7F2" }}>
      <Paper
        elevation={3}
        sx={{
          mx: "auto",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 4,
            py: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <UserRoundPlus className="w-7 h-7" />
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {isEdit ? "Edit Cafe" : "Create Cafe"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {!isEdit
                  ? "Enter cafe details to create a new account"
                  : "Update cafe details"}
              </Typography>
            </Box>
          </Box>

          <Button
            type="submit"
            form="admin-form"
            variant="contained"
            disabled={!isValid || isLoading || isSubmitting}
            sx={{
              bgcolor: "white",
              color: "#6F4E37",
              fontWeight: 600,
              px: 4,
              "&:hover": {
                bgcolor: "#F5EFE6",
              },
              "&:disabled": {
                bgcolor: "#E0E0E0",
                color: "#9E9E9E",
              },
            }}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </Box>

        <Box
          component="form"
          id="admin-form"
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{ px: 4, py: 4, bgcolor: "white" }}
        >
          <Grid container spacing={4}>
            {/* File Uploads */}
            {renderImageField("logo", "Cafe Logo", "logo-upload")}
            {renderImageField(
              "profileImage",
              "Profile Image",
              "profile-upload",
            )}

            {/* Basic Information */}
            {renderTextField(
              "firstName",
              "First Name *",
              <Users size={20} color="#6F4E37" />,
              "Enter First Name",
            )}
            {renderTextField(
              "lastName",
              "Last Name *",
              <Users size={20} color="#6F4E37" />,
              "Enter Last Name",
            )}
            {renderTextField(
              "email",
              "Email *",
              <Email sx={{ color: "#6F4E37", fontSize: 20 }} />,
              "Enter Email",
              isEdit,
            )}
            {renderTextField(
              "cafeName",
              "Cafe Name *",
              <Building2 size={20} color="#6F4E37" />,
              "Enter Cafe Name",
              isEdit,
            )}

            {/* Password Field - Only in Create Mode */}
            {!isEdit && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormLabel
                    sx={{
                      color: "#6F4E37",
                      fontWeight: 600,
                      mb: 1,
                      display: "block",
                    }}
                  >
                    Password *
                  </FormLabel>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.password}
                        size="small"
                      >
                        <OutlinedInput
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter Password"
                          sx={{
                            borderRadius: 2,
                            bgcolor: "#F5EFE6",
                            "&:hover": { bgcolor: "#EFE5D8" },
                          }}
                          startAdornment={
                            <InputAdornment position="start">
                              <Lock size={20} color="#6F4E37" />
                            </InputAdornment>
                          }
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        <FormHelperText>
                          {errors.password?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormLabel
                    sx={{ color: "#6F4E37", fontWeight: 600, mb: 1, display: "block" }}
                  >
                    Confirm Password *
                  </FormLabel>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.confirmPassword}
                        size="small"
                      >
                        <OutlinedInput
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter Password"
                          sx={{
                            borderRadius: 2,
                            bgcolor: "#F5EFE6",
                            "&:hover": { bgcolor: "#EFE5D8" },
                          }}
                          startAdornment={
                            <InputAdornment position="start">
                              <Lock size={20} color="#6F4E37" />
                            </InputAdornment>
                          }
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        <FormHelperText>
                          {errors.confirmPassword?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </Grid>

              </>
            )}

            {/* Contact Information Section */}
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  borderBottom: "2px solid #6F4E37",
                  pb: 1,
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={700} color="#6F4E37">
                  Contact Information
                </Typography>
              </Box>
            </Grid>

            {renderTextField(
              "phoneNumber",
              "Phone Number *",
              <Contact size={20} color="#6F4E37" />,
              "Enter Phone Number",
            )}
            {renderTextField(
              "address",
              "Address *",
              <MapPin size={20} color="#6F4E37" />,
              "Enter Address",
            )}
            {renderTextField(
              "city",
              "City *",
              null,
              "Enter City",
            )}

            {/* State Dropdown */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormLabel
                sx={{
                  color: "#6F4E37",
                  fontWeight: 600,
                  mb: 1,
                  display: "block",
                }}
              >
                State *
              </FormLabel>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    select
                    fullWidth
                    size="small"
                    error={!!errors.state}
                    helperText={errors.state?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#F5EFE6",
                        "&:hover": { bgcolor: "#EFE5D8" },
                      },
                    }}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                          },
                        },
                      },
                    }}
                  >
                    {statesData?.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {renderTextField(
              "pincode",
              "Pincode *",
              null,
              "Enter Pincode",
            )}
            {renderTextField(
              "gst",
              "GST Percentage *",
              null,
              "Enter GST Percentage",
              false,
              { xs: 12, sm: 6 },
              "number",
            )}

            {/* Operating Hours Section */}
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  borderBottom: "2px solid #6F4E37",
                  pb: 1,
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={700} color="#6F4E37">
                  Operating Hours
                </Typography>
              </Box>
            </Grid>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {renderTimeField(
                "hours.weekdays.open",
                "hours.weekdays.close",
                "Weekdays Hours",
              )}
              {renderTimeField(
                "hours.weekends.open",
                "hours.weekends.close",
                "Weekends Hours",
              )}
            </LocalizationProvider>

            {/* Social Media Links Section */}
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  borderBottom: "2px solid #6F4E37",
                  pb: 1,
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={700} color="#6F4E37">
                  Social Media Links
                </Typography>
              </Box>
            </Grid>

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
        </Box>
      </Paper>
    </Box>
  );
}