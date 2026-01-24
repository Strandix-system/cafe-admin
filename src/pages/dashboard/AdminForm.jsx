// import { useEffect, useState } from "react";

// const AdminForm = ({ initialData, onSubmit, onClose }) => {
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     cafeName: "",
//     email: "",
//     password: "",
//     phone: "",
//     address: "",
//     state: "",
//     city: "",
//     pinCode: "",
//     isActive: true,
//   });

//   useEffect(() => {
//     if (initialData) {
//       setForm({
//         ...initialData,
//         password: "", // don’t prefill password on edit
//       });
//     }
//   }, [initialData]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(form);
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold">
//           {initialData ? "Update Admin" : "Add Admin"}
//         </h2>
//         <button onClick={onClose} className="text-gray-500 text-xl">✕</button>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
//           <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
//           <Input label="Cafe Name" name="cafeName" value={form.cafeName} onChange={handleChange} />
//           <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          
//           {!initialData && (
//             <Input
//               label="Password"
//               name="password"
//               type="password"
//               value={form.password}
//               onChange={handleChange}
//             />
//           )}

//           <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} />
//           <Input label="State" name="state" value={form.state} onChange={handleChange} />
//           <Input label="City" name="city" value={form.city} onChange={handleChange} />
//           <Input label="Pin Code" name="pinCode" value={form.pinCode} onChange={handleChange} />
//         </div>

//         {/* Address */}
//         <div>
//           <label className="block text-sm font-medium text-gray-600 mb-1">
//             Address
//           </label>
//           <textarea
//             name="address"
//             value={form.address}
//             onChange={handleChange}
//             rows="3"
//             className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//         {/* Status */}
//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             name="isActive"
//             checked={form.isActive}
//             onChange={handleChange}
//             className="accent-indigo-600"
//           />
//           <span className="text-sm">Active Admin</span>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-3 pt-4 border-t">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 border rounded-md"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//           >
//             {initialData ? "Update Admin" : "Save Admin"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// /* Reusable Input Component */
// const Input = ({ label, name, type = "text", value, onChange }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-600 mb-1">
//       {label}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
//       required
//     />
//   </div>
// );

// export default AdminForm;

import { useCreateAdmin } from "../../utils/hooks/useCreateAdmin";

import { useEffect, useState } from "react";
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

const AdminForm = ({ initialData, onSubmit, onClose }) => {
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

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, password: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

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
    onSubmit(form);
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
