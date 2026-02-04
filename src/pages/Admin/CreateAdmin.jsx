// import { Box, Button, TextField, Typography, Grid, MenuItem } from "@mui/material";
// import { useForm, Controller } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { APIRequest } from "../../utils/api_request";
// import { adminFormDefaults } from "../../forms/adminForm.config";
// import { mapAdminPayload } from "../../utils/adminPayload.mapper";
// import { useState } from "react";

// const CreateAdmin = ({ onClose }) => {
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(false);

//     const {
//         control,
//         handleSubmit,
//         reset,
//         formState: { errors },
//     } = useForm({
//         defaultValues: adminFormDefaults,
//     });

//     const onSubmit = async (formData) => {
//         try {
//             setLoading(true);

//             const mapped = mapAdminPayload(formData);

//             const fd = new FormData();

//             Object.entries(mapped).forEach(([key, value]) => {
//                 if (value !== undefined && value !== null) {
//                     fd.append(key, value);
//                 }
//             });

//             console.log("Final FormData:");
//             for (let pair of fd.entries()) {
//                 //   console.log(pair[0], pair[1]);
//             }

//             await APIRequest.post("admin/create", fd, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             reset();
//             onClose?.();
//             alert("Admin created successfully");
//         } catch (error) {
//             console.error("Backend error:", error.response?.data);
//             alert(error.response?.data?.message || "Admin creation failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box p={3}>

//             <Typography variant="h6" fontWeight={600} mb={3}>
//                 Create Admin
//             </Typography>
//             <form onSubmit={handleSubmit(onSubmit)} noValidate>
//                 <Grid container spacing={2}>
//                     {/* Cafe Name */}
//                     <Grid size={6} sm={6}>
//                         <Controller
//                             name="cafeName"
//                             control={control}
//                             rules={{ required: "Cafe name is required" }}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     label="Cafe Name"
//                                     error={!!errors.cafeName}
//                                     helperText={errors.cafeName?.message}
//                                 />
//                             )}
//                         />
//                     </Grid>

//                     {/* Phone Number */}
//                     <Grid size={6} sm={2}>
//                         <Controller
//                             name="phoneNumber"
//                             control={control}
//                             rules={{ required: "Phone number is required" }}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     type="number"
//                                     fullWidth
//                                     label="Phone Number"
//                                     //   onChange={(e) => field.onChange(Number(e.target.value))}
//                                     error={!!errors.phoneNumber}
//                                     helperText={errors.phoneNumber?.message}
//                                 />
//                             )}
//                         />
//                     </Grid>
//                     {/* First Name */}
//                     <Grid size={6} sm={6}>
//                         <Controller
//                             name="firstName"
//                             control={control}
//                             rules={{ required: "First name is required" }}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     label="First Name"
//                                     error={!!errors.firstName}
//                                     helperText={errors.firstName?.message}
//                                 />
//                             )}
//                         />
//                     </Grid>

//                     {/* Last Name */}
//                     <Grid size={6} sm={6}>
//                         <Controller
//                             name="lastName"
//                             control={control}
//                             rules={{ required: "Last name is required" }}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     label="Last Name"
//                                     error={!!errors.lastName}
//                                     helperText={errors.lastName?.message}
//                                 />
//                             )}
//                         />
//                     </Grid>

//                     {/* Email */}
//                     <Grid size={6} sm={6}>
//                         <Controller
//                             name="email"
//                             control={control}
//                             rules={{
//                                 required: "Email is required",
//                                 pattern: {
//                                     value: /^\S+@\S+\.\S+$/,
//                                     message: "Invalid email address",
//                                 },
//                             }}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     label="Email"
//                                     error={!!errors.email}
//                                     helperText={errors.email?.message}
//                                 />
//                             )}
//                         />
//                     </Grid>

//                     {/* Password */}
//                     <Grid size={6} sm={6}>
//                         <Controller
//                             name="password"
//                             control={control}
//                             rules={{
//                                 required: "Password is required",
//                                 pattern: {
//                                     value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
//                                     message: "Must include upper, lower, number & special char",
//                                 },
//                             }}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     type="password"
//                                     label="Password"
//                                     error={!!errors.password}
//                                     helperText={errors.password?.message}
//                                 />
//                             )}
//                         />
//                     </Grid>
//                     {/* Address */}
//                     <Grid size={6}>
//                         <Controller
//                             name="address"
//                             control={control}
//                             rules={{ required: "Address is required" }}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     label="Address"
//                                     error={!!errors.address}
//                                     helperText={errors.address?.message}
//                                 />
//                             )}
//                         />
//                     </Grid>
//                     {/* City */}
//                     <Grid size={6} sm={6}>
//                         <Controller
//                             name="city"
//                             control={control}
//                             rules={{ required: "City is required" }}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     label="City"
//                                     error={!!errors.city}
//                                     helperText={errors.city?.message}
//                                 />
//                             )}
//                         />
//                     </Grid>

//                     {/* State */}
//                     <Grid size={6} sm={6}>
//                         <Controller
//                             name="state"
//                             control={control}
//                             rules={{ required: "State is required" }}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     select
//                                     fullWidth
//                                     label="State"
//                                     error={!!errors.state}
//                                     helperText={errors.state?.message}
//                                 >
//                                     <MenuItem value="Madhya Pradesh">Madhya Pradesh</MenuItem>
//                                 </TextField>
//                             )}
//                         />
//                     </Grid>

//                     {/* Pincode */}
//                     <Grid size={6} sm={6}>
//                         <Controller
//                             name="pincode"
//                             control={control}
//                             rules={{ required: "Pincode is required" }}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     label="Pincode"
//                                     //   onChange={(e) => field.onChange(Number(e.target.value))}
//                                     error={!!errors.pincode}
//                                     helperText={errors.pincode?.message}
//                                 />
//                             )}
//                         />
//                     </Grid>
//                     <Grid size={6} sm={6}>
//                         <Controller
//                             name="logo"
//                             control={control}
//                             rules={{ required: "Logo is required" }}
//                             render={({ field }) => (
//                                 <TextField
//                                     type="file"
//                                     fullWidth
//                                     inputProps={{ accept: "image/*" }}
//                                     onChange={(e) => field.onChange(e.target.files[0])}
//                                     error={!!errors.logo}
//                                     helperText={errors.logo?.message}
//                                 />
//                             )}
//                         />
//                     </Grid>
//                     <Grid size={6} sm={6}>
//                         <Controller
//                             name="profileImage"
//                             control={control}
//                             rules={{ required: "Profile image is required" }}
//                             render={({ field }) => (
//                                 <TextField
//                                     type="file"
//                                     fullWidth
//                                     inputProps={{ accept: "image/*" }}
//                                     onChange={(e) => field.onChange(e.target.files[0])}
//                                     error={!!errors.profileImage}
//                                     helperText={errors.profileImage?.message}
//                                 />
//                             )}
//                         />
//                     </Grid>
//                 </Grid>
//                 <Box mt={3} display="flex" gap={2}>
//                     <Button type="submit" variant="contained" disabled={loading}>
//                         {loading ? "Saving..." : "Save"}
//                     </Button>
//                     <Button
//                         variant="outlined"
//                         onClick={() => navigate("/admin/form/AdminForm")}
//                     >
//                         Edit
//                     </Button>
//                     <Button variant="outlined" onClick={() => navigate(-1)} disabled={loading}>
//                         Cancel
//                     </Button>

//                 </Box>
//             </form>
//         </Box>
//     );
// };

// export default CreateAdmin;

import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Grid,
  TextField,
  FormLabel,
  MenuItem,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { AdminSchema } from "./admin.schema";
import { adminFormDefaults } from "./adminForm.config";
import { API_ROUTES } from "../../utils/api_constants";
import { APIRequest } from "../../utils/api_request";
import { mapAdminPayload } from "../../utils/adminPayload.mapper";

export default function AdminForm({
  defaultValues = adminFormDefaults,
  onSubmit,
  isLoading = false,
  isEdit = false,
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    resolver: yupResolver(AdminSchema),
    mode: "all",
  });


  const handleCreateAdmin = async (data) => {
  try {
    const payload = mapAdminPayload(data);

    await APIRequest.post(
      API_ROUTES.adminCreate,
      payload
    );

    alert("Admin created successfully");
  } catch (err) {
    console.error(err);
  }
};

//   const handleFormSubmit = (data) => {
    // const fd = new FormData();

    // Object.entries(data).forEach(([key, value]) => {
    //   if (value !== null && value !== undefined) {
    //     fd.append(key, value);
    //   }
    // });

//     onSubmit(data);
//   };
const handleFormSubmit = async (data) => {
  await handleCreateAdmin(data);
};


  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={2}>

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
                error={!!errors.cafeName}
                helperText={errors.cafeName?.message}
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
                disabled={isEdit}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Grid>

        {!isEdit && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormLabel>Password</FormLabel>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  fullWidth
                  size="small"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
          </Grid>
        )}

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
                fullWidth
                size="small"
                error={!!errors.state}
                helperText={errors.state?.message}
              />
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
        <Grid size={{ xs: 12, sm: 6 }}>
  <FormLabel>Selected Layout</FormLabel>
  <Controller
    name="selectedLayout"
    control={control}
    render={({ field }) => (
      <TextField
        {...field}
        select
        fullWidth
        size="small"
        error={!!errors.selectedLayout}
        helperText={errors.selectedLayout?.message}
      >
         <MenuItem value="layout1">Layout 1</MenuItem>
        {/* <MenuItem value="layout2">Layout 2</MenuItem>
        <MenuItem value="layout3">Layout 3</MenuItem>  */}
      </TextField>
    )}
  />
</Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormLabel>Logo</FormLabel>
          <Controller
            name="logo"
            control={control}
            render={({ field }) => (
              <TextField
                type="file"
                fullWidth
                inputProps={{ accept: "image/*" }}
                onChange={(e) => field.onChange(e.target.files[0])}
                error={!!errors.logo}
                helperText={errors.logo?.message}
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
                inputProps={{ accept: "image/*" }}
                onChange={(e) => field.onChange(e.target.files[0])}
                error={!!errors.profileImage}
                helperText={errors.profileImage?.message}
              />
            )}
          />
        </Grid>
      </Grid>

      <Box mt={4} display="flex" justifyContent="center">
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid || isLoading}
        >
          {isEdit ? "Update Admin" : "Create Admin"}
        </Button>
      </Box>
    </form>
  );
}

