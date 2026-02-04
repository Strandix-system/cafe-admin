import { Box, TextField, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";

export default function BasicInfoForm() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Basic Info:", data);
    // API call here
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} maxWidth={600}>
      <Stack spacing={3}>
        <TextField label="Name" {...register("name")} fullWidth />
        <TextField label="Email" {...register("email")} fullWidth />
        <TextField label="Phone" {...register("phone")} fullWidth />

        <Button type="submit" variant="contained" sx={{ width: 120 }}>
          Save
        </Button>
      </Stack>
    </Box>
  );
}
