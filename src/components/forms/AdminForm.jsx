import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    TextField,
    Button,
    Box,
    MenuItem,
} from "@mui/material";

import { adminSchema } from "./adminForm.schema";
import { ADMIN_FORM_FIELDS } from "./adminForm.constants";

export default function AdminForm({ onSubmit, isLoading }) {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: ADMIN_FORM_FIELDS,
        resolver: yupResolver(adminSchema),
        mode: "all",
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="grid" gap={2} gridTemplateColumns="1fr 1fr">

                {/* First Name */}
                <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="First Name"
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    )}
                />

                {/* Last Name */}
                <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Last Name"
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    )}
                />

                {/* Email */}
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    )}
                />

                {/* Password */}
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="password"
                            label="Password"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    )}
                />
                {/* Cafe Name */}
                <Controller
                    name="cafeName"
                    control={control}
                    render={({ field }) => (
                        <TextField {...field} label="Cafe Name" />
                    )}
                />

                {/* Phone */}
                <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                        <TextField {...field} label="Phone Number" />
                    )}
                />
                <Controller
                    name="logo"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            type="file"
                            inputProps={{ accept: "image/*" }}
                            onChange={(e) => field.onChange(e.target.files[0])}
                            error={!!errors.logo}
                            helperText={errors.logo?.message}
                        />
                    )}
                />
                <Controller
                    name="profileImage"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            type="file"
                            inputProps={{ accept: "image/*" }}
                            onChange={(e) => field.onChange(e.target.files[0])}
                            error={!!errors.profileImage}
                            helperText={errors.profileImage?.message}
                        />
                    )}
                />

                {/* Layout */}
            </Box>

            <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ mt: 3 }}
            >
                Save
            </Button>
        </form>
    );
}
