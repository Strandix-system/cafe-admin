import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button, Box } from "@mui/material";
import { adminBasicSchema } from "./schemas/adminBasic.schema";
import { ADMIN_BASIC_DEFAULTS } from "./defaults/adminBasic.defaults";

export default function AdminBasicForm({ onSubmit, isLoading }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: ADMIN_BASIC_DEFAULTS,
    resolver: yupResolver(adminBasicSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="grid" gap={2}>
        <Controller name="firstName" control={control}
          render={({ field }) => (
            <TextField {...field} label="First Name" error={!!errors.firstName}
              helperText={errors.firstName?.message} />
          )}
        />

        <Controller name="lastName" control={control}
          render={({ field }) => (
            <TextField {...field} label="Last Name" error={!!errors.lastName}
              helperText={errors.lastName?.message} />
          )}
        />

        <Controller name="email" control={control}
          render={({ field }) => (
            <TextField {...field} label="Email" error={!!errors.email}
              helperText={errors.email?.message} />
          )}
        />

        <Controller name="phoneNumber" control={control}
          render={({ field }) => (
            <TextField {...field} label="Phone Number" error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message} />
          )}
        />

        <Button type="submit" variant="contained" disabled={isLoading}>
          Update Profile
        </Button>
      </Box>
    </form>
  );
}
