import { yupResolver } from "@hookform/resolvers/yup";
import {
  Close,
  Email,
  PhotoCamera,
  Visibility,
  VisibilityOff,
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
  Avatar,
} from "@mui/material";
import {
  Building2,
  Contact,
  Lock,
  MapPin,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Loader from "../common/Loader";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { adminSchema } from "../../utils/adminSchema/adminSchema";
import ImageUploadSection from "../common/ImageUploadSection";
import InputField from "../common/InputField";
import { useImageUpload } from "../../utils/hooks/useImageUpload";

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
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      cafeName: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      gst: "",
      logo: null,
      profileImage: null,
    },
    resolver: yupResolver(adminSchema),
    context: { isEdit },
    mode: "all",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const { data: { data: statesData } = {} } = useFetch(
    "states",
    API_ROUTES.getstates,
  );

  const { previews, handleImageChange, handleReplaceImage, setPreview } =
    useImageUpload(setValue);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      phoneNumber: Number(data.phoneNumber),
      gst: Number(data.gst),
    });
  };

  const handleRemoveImage = (field) => {
    setLogoPreview(null);
    field.onChange(null);
  };

  useEffect(() => {
    if (isEdit) {
      reset(defaultValues);
      // Set image previews from deployed URLs
      if (defaultValues.logo) {
        setLogoPreview(defaultValues.logo);
      }
      if (defaultValues.profileImage) {
        setProfilePreview(defaultValues.profileImage);
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="logo"
                control={control}
                render={({ field }) => (
                  <ImageUploadSection
                    label="Cafe Logo"
                    field={field}
                    preview={previews["logo"]}
                    setPreview={(preview) => setPreview("logo", preview)}
                    handleImageChange={(file) => handleImageChange(file, "logo")}
                    handleRemoveImage={() => handleRemoveImage("logo")}
                    handleReplaceImage={() => handleReplaceImage("logo")}
                    inputId="logo-upload"
                    isEdit={isEdit}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="profileImage"
                control={control}
                render={({ field }) => (
                  <ImageUploadSection
                    label="Profile Image"
                    field={field}
                    preview={previews["profileImage"]}
                    setPreview={(preview) => setPreview("profileImage", preview)}
                    handleImageChange={(file) => handleImageChange(file, "profileImage")}
                    handleRemoveImage={() => handleRemoveImage("profileImage")}
                    handleReplaceImage={() => handleReplaceImage("profileImage")}
                    inputId="profile-upload"
                    isEdit={isEdit}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormLabel sx={{ color: "#6F4E37", fontWeight: 600, mb: 1 }}>
                First Name *
              </FormLabel>

              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <InputField
                    field={field}
                    error={errors.firstName}
                    helperText={errors.firstName?.message}
                    placeholder="Enter First Name"
                    startIcon={<Users size={20} color="#6F4E37" />}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormLabel
                sx={{
                  color: "#6F4E37",
                  fontWeight: 600,
                  mb: 1,
                  display: "block",
                }}
              >
                Last Name *
              </FormLabel>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#F5EFE6",
                        "&:hover": { bgcolor: "#EFE5D8" },
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormLabel
                sx={{
                  color: "#6F4E37",
                  fontWeight: 600,
                  mb: 1,
                  display: "block",
                }}
              >
                Email *
              </FormLabel>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    disabled={isEdit}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#F5EFE6",
                        "&:hover": { bgcolor: "#EFE5D8" },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: "#6F4E37", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormLabel
                sx={{
                  color: "#6F4E37",
                  fontWeight: 600,
                  mb: 1,
                  display: "block",
                }}
              >
                Cafe Name *
              </FormLabel>
              <Controller
                name="cafeName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    disabled={isEdit}
                    error={!!errors.cafeName}
                    helperText={errors.cafeName?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#F5EFE6",
                        "&:hover": { bgcolor: "#EFE5D8" },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Building2 size={20} color="#6F4E37" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {!isEdit && (
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
            )}

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

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormLabel
                sx={{
                  color: "#6F4E37",
                  fontWeight: 600,
                  mb: 1,
                  display: "block",
                }}
              >
                Phone Number *
              </FormLabel>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#F5EFE6",
                        "&:hover": { bgcolor: "#EFE5D8" },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Contact size={20} color="#6F4E37" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormLabel
                sx={{
                  color: "#6F4E37",
                  fontWeight: 600,
                  mb: 1,
                  display: "block",
                }}
              >
                Address *
              </FormLabel>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#F5EFE6",
                        "&:hover": { bgcolor: "#EFE5D8" },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapPin size={20} color="#6F4E37" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormLabel
                sx={{
                  color: "#6F4E37",
                  fontWeight: 600,
                  mb: 1,
                  display: "block",
                }}
              >
                City *
              </FormLabel>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    error={!!errors.city}
                    helperText={errors.city?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#F5EFE6",
                        "&:hover": { bgcolor: "#EFE5D8" },
                      },
                    }}
                  />
                )}
              />
            </Grid>

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

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormLabel
                sx={{
                  color: "#6F4E37",
                  fontWeight: 600,
                  mb: 1,
                  display: "block",
                }}
              >
                Pincode *
              </FormLabel>
              <Controller
                name="pincode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    error={!!errors.pincode}
                    helperText={errors.pincode?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#F5EFE6",
                        "&:hover": { bgcolor: "#EFE5D8" },
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormLabel
                sx={{
                  color: "#6F4E37",
                  fontWeight: 600,
                  mb: 1,
                  display: "block",
                }}
              >
                GST Percentage *
              </FormLabel>
              <Controller
                name="gst"
                control={control}
                render={({ field }) => (
                  <InputField
                    field={field}
                    error={errors.gst}
                    helperText={errors.gst?.message}
                    placeholder="Enter GST Percentage"
                    type="number"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
