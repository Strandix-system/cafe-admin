import { Box, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";

export default function ProfileForm({ onClose }) {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log("Profile Data:", data);
        onClose();
    };

    return (
        <Box p={4}>
            <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
                <TextField label="Name" {...register("name")} fullWidth margin="normal" />
                <TextField label="Email" {...register("email")} fullWidth margin="normal" />
                <TextField label="Phone" {...register("phone")} fullWidth margin="normal" />
                <Button type="submit" variant="contained" sx={{
                    position: "relative",
                    backgroundColor: "#6f4e37",
                }}>
                    Save
                </Button>
            </form>
        </Box>
    );
}


