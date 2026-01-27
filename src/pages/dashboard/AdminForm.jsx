import { useCreateAdmin } from "../../utils/hooks/useCreateAdmin";
// import { API_ROUTES } from "../../constants/api_constants";
import { useEffect, useState } from "react";
import {usePost } from "../../utils/hooks/api_hooks"
import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { APIRequest } from "../../utils/api_request";
import { API_ROUTES } from "../../utils/api_constants";

const STATES = [
  "Madhya Pradesh",
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "Tamil Nadu",
  "West Bengal",
];

const AdminForm = ({ initialData, onClose }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    cafeName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    pinCode: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
//   const { mutate, isLoading } = useCreateAdmin();

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, password: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };
  const { mutate, isPending, isError } = usePost(
  API_ROUTES.CREATE_ADMIN,
  {
    onSuccess: (res) => {
      console.log("Admin created ✅", res);
    },
    onError: (err) => {
      console.error("Create admin failed ❌", err);
    },
  }, {}
);


  const validate = () => {
    const newErrors = {};

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!/^\d{6}$/.test(form.pinCode)) {
      newErrors.pinCode = "Pin code must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
   
     mutate(form, {
    onSuccess: () => {
      onClose(); // close dialog after success
    },
    onError: (error) => {
      console.error("Create admin failed:", error);
    },
})
  };

  return (
    <Box  maxWidth="1100px"
  mx="auto"
  bgcolor="#fff"
  p={4}
  borderRadius={2}
  boxShadow={2}>
      <Typography variant="h6" mb={2}>
        {initialData ? "Update Admin" : "Add Admin"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="First Name" name="firstName" fullWidth required value={form.firstName} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField label="Last Name" name="lastName" fullWidth required value={form.lastName} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField label="Cafe Name" name="cafeName" fullWidth required value={form.cafeName} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              required
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          {!initialData && (
            <Grid item xs={12} md={6}>
              <TextField label="Password" name="password" type="password" fullWidth required value={form.password} onChange={handleChange} />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <TextField
              label="Phone Number"
              name="phone"
              fullWidth
              required
              value={form.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <Select name="state" value={form.state} onChange={handleChange} displayEmpty>
                <MenuItem value="" disabled>Select State</MenuItem>
                {STATES.map((state) => (
                  <MenuItem key={state} value={state}>{state}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField label="City" name="city" fullWidth required value={form.city} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Pin Code"
              name="pinCode"
              fullWidth
              required
              value={form.pinCode}
              onChange={handleChange}
              error={!!errors.pinCode}
              helperText={errors.pinCode}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              fullWidth
              multiline
              rows={3}
              value={form.address}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={form.isActive} name="isActive" onChange={handleChange} />}
              label="Active Admin"
            />
          </Grid>
        </Grid>

        <DialogActions sx={{ mt: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" type="submit">
            {initialData ? "Update Admin" : "Save Admin"}
          </Button>
        </DialogActions>
      </form>
    </Box>
  );
};

export default AdminForm;
