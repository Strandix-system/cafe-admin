import React from "react";
import {
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    FormLabel,
    TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePost } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { toast } from "react-hot-toast";
import {InputField} from "../../components/common/InputField";
import { useNavigate } from "react-router-dom";
import {CommonButton} from "../../components/common/commonButton";

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

const schema = yup.object().shape({
    currentPassword: yup
        .string()
        .required("Current password is required"),
    newPassword: yup
        .string()
        .required("New password is required")
        .matches(
            passwordRegex,
            "Min 8 chars, 1 uppercase, 1 lowercase & 1 special character required"
        ),
    confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export const ChangePassword = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
    });
    const navigate = useNavigate();

    const { mutate, isPending } = usePost(API_ROUTES.changePassword, {
        onSuccess: () => {
            toast.success("Password changed successfully ✅");
            navigate("/dashboard");
            reset();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onSubmit = (data) => {
        delete data.confirmPassword;
        mutate(data);;
    };

    const renderTextField = (
        name,
        label,
        icon,
        placeholder,
        disabled = false,
        gridSize = { xs: 12 },
        type = "text",
    ) => (
        <Grid size={gridSize}>
            <FormLabel
                sx={{
                    color: "#6F4E37",
                    fontWeight: 600,
                    mb: 1,
                    display: "block",
                }}
            >
                {label}
            </FormLabel>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <InputField
                        field={field}
                        error={
                            name.includes(".")
                                ? name
                                    .split(".")
                                    .reduce((obj, key) => obj?.[key], errors)
                                : errors[name]
                        }
                        helperText={
                            name.includes(".")
                                ? name
                                    .split(".")
                                    .reduce((obj, key) => obj?.[key], errors)?.message
                                : errors[name]?.message
                        }
                        placeholder={placeholder}
                        disabled={disabled}
                        startIcon={icon}
                        type={type}
                    />
                )}
            />
        </Grid>
    );

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="70vh"
        >
            <Card sx={{ width: 420, p: 2, borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" mb={3} fontWeight="bold">
                        Change Password
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            {renderTextField("currentPassword", "Current Password", null, "Enter Current Password", null, { xs: 12 }, "text")}
                            {renderTextField("newPassword", "New Password", null, "Enter New Password", null, { xs: 12 }, "password")}
                            {renderTextField("confirmPassword", "Confirm Password", null, "Confirm New Password", null, { xs: 12 }, "password")}
                        </Grid>
                        <CommonButton
                            fullWidth
                            variant="contained"
                            type="submit"
                            loading={isPending}
                            sx={{ mt: 3, py: 1.2 }}
                        >
                            Update Password
                        </CommonButton>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};
