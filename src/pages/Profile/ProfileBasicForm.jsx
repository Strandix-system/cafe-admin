import { Grid, TextField, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProfileSchema } from "../Profile/Profile.schema";

export default function ProfileBasicForm({ defaultValues }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    resolver: yupResolver(ProfileSchema),
    mode: "all",
  });

  const onSubmit = (data) => {
    console.log("Updated Profile:", data);
    // API call here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="First Name" />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Last Name" />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Email" disabled />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Phone Number" />
            )}
          />
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        disabled={!isValid}
        sx={{ mt: 3 }}
      >
        Save Changes
      </Button>
    </form>
  );
}
