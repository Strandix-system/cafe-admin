import { useState, useEffect, useMemo } from "react";
import {
    Button,
    Box,
    Typography,
    Paper,
    IconButton,
    CircularProgress,
    LinearProgress,
} from "@mui/material";
import {
    Lock,
    Visibility,
    VisibilityOff,
    CheckCircle,
    ErrorOutline,
} from "@mui/icons-material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import cafe1 from "../../assets/cafe1.jpg";
import InputField from "../../components/common/InputField";
import { usePost } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import CommonButton from "../../components/common/commonButton";

const passwordSchema = yup.object({
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
});

const calculatePasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    const configs = [
        { threshold: 40, label: "Weak", color: "#ef4444" },
        { threshold: 60, label: "Fair", color: "#f59e0b" },
        { threshold: 80, label: "Good", color: "#84cc16" },
        { threshold: 100, label: "Strong", color: "#10b981" },
    ];

    const config = configs.find((c) => strength < c.threshold) || configs[configs.length - 1];
    return { strength, label: config.label, color: config.color };
};

const containerSx = {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    px: 2,
    backgroundImage: `linear-gradient(rgba(62,39,35,0.75), rgba(62,39,35,0.75)), url(${cafe1})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
};

const paperSx = {
    p: 4,
    width: "100%",
    maxWidth: 420,
    borderRadius: 4,
    textAlign: "center",
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(50px)",
};

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(passwordSchema),
        mode: "onChange",
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");

    // Backend verifies token through middleware, so we only need resetPassword API
    const { mutate: resetPasswordMutate, isPending, isError } = usePost(
        `${API_ROUTES.resetPassword}/${token}`, // Token passed as query param
        {
            onSuccess: () => {
                setResetSuccess(true);
                toast.success("Password reset successfully!");
            },
            onError: (error) => {
                // If token is invalid, middleware will reject with 401/403
                toast.error(error || "Failed to reset password. Please try again.");
            },
        }
    );

    useEffect(() => {
        if (!token) {
            toast.error("Invalid reset link");
            setTimeout(() => navigate("/forgot-password"), 2000);
        }
    }, [token, navigate]);

    const { strength, label, color } = useMemo(() => calculatePasswordStrength(password), [password]);

    const onSubmit = (data) => resetPasswordMutate({ password: data.password });

    // Show error state if token is missing
    if (!token) {
        return (
            <Box sx={containerSx}>
                <Paper elevation={10} sx={paperSx}>
                    <ErrorOutline sx={{ fontSize: 64, color: "#ef4444", mb: 2 }} />
                    <Typography variant="h5" fontWeight="700" sx={{ color: "#3E2723", fontFamily: "'Playfair Display', serif", mb: 2 }}>
                        Invalid Reset Link
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#5D4037", mb: 3 }}>
                        This password reset link is invalid or missing.
                    </Typography>
                    {/* <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate("/forgot-password")}
                        sx={{
                            py: 1.5,
                            borderRadius: 3,
                            textTransform: "none",
                            fontSize: "1rem",
                            fontWeight: 600,
                            backgroundColor: "#6F4E37",
                            "&:hover": { backgroundColor: "#5D4037" },
                        }}
                    >
                        Request New Link
                    </Button> */}
                    <CommonButton fullWidth onClick={() => navigate("/forgot-password")}>
                        Request New Link
                    </CommonButton>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={containerSx}>
            <Paper elevation={10} sx={paperSx}>
                {!resetSuccess ? (
                    <>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h4" fontWeight="700" sx={{ color: "#3E2723", fontFamily: "'Playfair Display', serif" }}>
                                Reset Password
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#5D4037", mt: 1 }}>
                                Create a new secure password ☕
                            </Typography>
                        </Box>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box sx={{ mt: 2, mb: 2 }}>
                                <InputField
                                    field={register("password")}
                                    label="New Password"
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

                            {password && (
                                <Box sx={{ mt: 1, mb: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                                        <Typography variant="caption" sx={{ color: "#5D4037", fontSize: "0.75rem" }}>
                                            Password Strength
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: color, fontWeight: 600, fontSize: "0.75rem" }}>
                                            {label}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={strength}
                                        sx={{
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: "#E0E0E0",
                                            "& .MuiLinearProgress-bar": { backgroundColor: color, borderRadius: 3 },
                                        }}
                                    />
                                </Box>
                            )}

                            <Box sx={{ mt: 2, mb: 2 }}>
                                <InputField
                                    field={register("confirmPassword")}
                                    label="Confirm Password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    error={errors.confirmPassword}
                                    helperText={errors.confirmPassword?.message}
                                    startIcon={<Lock fontSize="small" />}
                                    endIcon={
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    }
                                />
                            </Box>
                            {/* <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                disabled={!isValid || isPending}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    borderRadius: 3,
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                    backgroundColor: "#6F4E37",
                                    "&:hover": { backgroundColor: "#5D4037" },
                                }}
                            >
                                {isPending ? <CircularProgress size={26} color="inherit" /> : "Reset Password"}
                            </Button> */}
                            <CommonButton
                                type="submit"
                                fullWidth
                                loading={isPending}
                                disabled={!isValid}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Reset Password
                            </CommonButton>

                        </form>
                    </>
                ) : (
                    <>
                        <CheckCircle sx={{ fontSize: 64, color: "#6F4E37", mb: 2 }} />
                        <Typography variant="h5" fontWeight="700" sx={{ color: "#3E2723", fontFamily: "'Playfair Display', serif", mb: 2 }}>
                            Password Reset!
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#5D4037", mb: 3, lineHeight: 1.6 }}>
                            Your password has been successfully reset.
                            <br />
                            You can now log in with your new password.
                        </Typography>
                        {/* <Button
                            fullWidth
                            variant="contained"
                            onClick={() => navigate("/login")}
                            sx={{
                                py: 1.5,
                                borderRadius: 3,
                                textTransform: "none",
                                fontSize: "1rem",
                                fontWeight: 600,
                                backgroundColor: "#6F4E37",
                                "&:hover": { backgroundColor: "#5D4037" },
                            }}
                        >
                            Go to Login
                        </Button> */}
                        <CommonButton fullWidth onClick={() => navigate("/login")}>
                            Go to Login
                        </CommonButton>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default ResetPassword;
