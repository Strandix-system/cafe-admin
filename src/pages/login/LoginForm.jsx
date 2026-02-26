import { useState } from "react";
import { Box, FormControlLabel, Checkbox, Link, Typography, IconButton } from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {InputField} from "../../components/common/InputField";
import { useAuth } from "../../context/AuthContext";
import { API_ROUTES } from "../../utils/api_constants";
import { usePost } from "../../utils/hooks/api_hooks";
import toast from "react-hot-toast";
import {CommonButton} from "../../components/common/commonButton";

const loginSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
});

export const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const { mutate: loginMutate, isPending: loginPending } = usePost(API_ROUTES.login, {
        onSuccess: async (res) => {
            await login(res.result.token);
            reset();
            toast.success("Logged in successfully!!");
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onSubmit = (data) => {
        loginMutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mt: 2, mb: 2 }}>
                <InputField
                    field={register("email")}
                    label="Email Address"
                    error={errors.email}
                    helperText={errors.email?.message}
                    startIcon={<Email fontSize="small" />}
                />
            </Box>

            <Box sx={{ mt: 2, mb: 2 }}>
                <InputField
                    field={register("password")}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    error={errors.password}
                    helperText={errors.password?.message}
                    startIcon={<Lock fontSize="small" />}
                    endIcon={
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    }
                />
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                    }
                    label={<Typography variant="body2">Remember me</Typography>}
                />
                <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => navigate("/forgot-password")}
                    sx={{
                        color: "#6F4E37",
                        fontWeight: 600,
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                    }}
                >
                    Forgot password?
                </Link>
            </Box>

            <CommonButton
                fullWidth
                type="submit"
                loading={loginPending}
                disabled={!isValid}
                sx={{ mt: 3, mb: 2 }}
            >
                Log In
            </CommonButton>
        </form>
    );
};
