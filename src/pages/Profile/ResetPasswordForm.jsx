import { TextField, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

export default function ResetPasswordForm() {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Password data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="oldPassword"
        control={control}
        render={({ field }) => (
          <TextField {...field} fullWidth type="password" label="Old Password" />
        )}
      />

      <Controller
        name="newPassword"
        control={control}
        render={({ field }) => (
          <TextField {...field} fullWidth type="password" label="New Password" sx={{ mt: 2 }} />
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <TextField {...field} fullWidth type="password" label="Confirm Password" sx={{ mt: 2 }} />
        )}
      />

      <Button type="submit" variant="contained" sx={{ mt: 3 }}>
        Update Password
      </Button>
    </form>
  );
}
