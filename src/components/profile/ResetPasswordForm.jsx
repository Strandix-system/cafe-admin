import { Box, TextField, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";

export default function ResetPasswordForm() {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log("Password Reset:", data);
        // API call here
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} maxWidth={600}>
            <Stack spacing={3}>
                <TextField
                    label="New Password"
                    type="password"
                    {...register("password")}
                    fullWidth
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    {...register("confirmPassword")}
                    fullWidth
                />

                <Button type="submit" variant="contained" sx={{ width: 180 }}>
                    Reset Password
                </Button>
            </Stack>
        </Box>
    );
}
