// // import { useAuth } from "@/context/AuthContext";
// import { API_ROUTES } from "@/utils/constants";
// import { useFetch } from "@/utils/hooks/useApi";
// import { Userschema } from "@/utils/Userschema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Email, Visibility, VisibilityOff } from "@mui/icons-material";
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
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { AdminSchema } from "../../utils/adminSchema/AdminSchema";

export default function FormComponent({
  defaultValues,
  onSubmit,
  isEdit = false,
  isLoading = false,
}) {
//   const { isSuperAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    resolver: yupResolver(AdminSchema),
    context: { isEdit },
    mode: "all",
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const [showPassword, setShowPassword] = useState(false);
  const { data: statesData } = useFetch("states", API_ROUTES.states);
  const STATES = statesData?.data || [];

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      phoneNumber: Number(data.phoneNumber),
    });
  };

  if (isLoading)
    return (
      <div>
        <Loader variant="spinner" />
      </div>
    );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="px-10 py-6">
      <div className="flex flex-col items-center mb-8">
        <div className="flex gap-3 items-center justify-between w-full">
          <Button
            variant="outlined"
            sx={{ mb: 2 }}
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
          <div className="flex items-center">
            <UserRoundPlus className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold">
              {" "}
              {isEdit ? "Edit User" : "Create Admin"}
            </h2>
          </div>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || isLoading}
          >
            {isEdit ? "Update " : "Create"}
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          {!isEdit
            ? "Enter user details to create a new account"
            : "Update user details"}
        </p>
      </div>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormLabel>Cafe Logo</FormLabel>
          <Controller
            name="logo"
            control={control}
            render={({ field }) => (
              <TextField
                type="file"
                fullWidth
                size="small"
                inputProps={{ accept: "image/*" }}
                onChange={(e) => field.onChange(e.target.files[0])}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormLabel>Profile Image</FormLabel>
          <Controller
            name="profileImage"
            control={control}
            render={({ field }) => (
              <TextField
                type="file"
                fullWidth
                size="small"
                inputProps={{ accept: "image/*" }}
                onChange={(e) => field.onChange(e.target.files[0])}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormLabel>First Name</FormLabel>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Users />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormLabel>Last Name</FormLabel>
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
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormLabel>Email</FormLabel>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                disabled={isEdit} // Disabled in edit mode
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>

        {/* {isSuperAdmin && ( */}
          <Grid size={{ xs: 12 }}>
            <FormLabel>Cafe Name</FormLabel>
            <Controller
              name="cafeName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  disabled={isEdit} // Disabled in edit mode
                  error={!!errors.cafeName}
                  helperText={errors.cafeName?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Building2 />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
        {/* )} */}

        {/* Password field - only show when NOT editing */}
        {!isEdit && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormLabel>Password</FormLabel>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.password} size="small">
                  <OutlinedInput
                    {...field}
                    type={showPassword ? "text" : "password"}
                    startAdornment={
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText>{errors.password?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
        )}
        {/* {isAdmin && ( */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormLabel>App Password</FormLabel>
            <Controller
              name="appPassword"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.password} size="small">
                  <OutlinedInput
                    {...field}
                    type={showPassword ? "text" : "password"}
                    startAdornment={
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText>{errors.password?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
        {/* )} */}

        <Grid size={{ xs: 12 }}>
          <h3 className="text-xl font-semibold text-gray-700 mt-2 border-b-2 border-b-black">
            Contact Information
          </h3>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormLabel>Phone Number</FormLabel>
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Contact />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormLabel>Address</FormLabel>
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MapPin />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormLabel>City</FormLabel>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder=""
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormLabel>State</FormLabel>
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
                SelectProps={{
                  MenuProps: {
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  },
                }}
              >
                {STATES.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormLabel>Pincode</FormLabel>
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
              />
            )}
          />
        </Grid>
      </Grid>

      <div className="flex gap-5 mt-6 justify-center">
        {/* <Button
          type="submit"
          variant="contained"
          disabled={!isValid || isLoading}
        >
          {isEdit ? "Update " : "Create"}
        </Button> */}
      </div>
    </form>
  );
}
