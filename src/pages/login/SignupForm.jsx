import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Person, Phone } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { CommonButton } from "../../components/common/commonButton";
import { CommonTextField } from "../../components/common/CommonTextField";

const signupSchema = yup.object({
    firstName: yup.string().trim().required("First name is required"),
    lastName: yup.string().trim().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: yup
        .string()
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit contact number")
        .required("Contact number is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
});

export const SignupForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(signupSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
        },
        mode: "all",
    });

    const onSubmit = (data) => {
        localStorage.setItem(
            "signupData",
            JSON.stringify({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                password: data.password,

            })
        );
        reset();
        toast.success("Redirecting to plans...");
        navigate("/plans");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mt: 2, mb: 2, display: "flex", gap: 2 }}>
                <CommonTextField
                    name="firstName"
                    control={control}
                    placeholder="First Name"
                    errors={errors}
                    helperText={errors.firstName?.message}
                    startIcon={<Person fontSize="small" />}
                />

                <CommonTextField
                    name="lastName"
                    control={control}
                    placeholder="Last Name"
                    errors={errors}
                    helperText={errors.lastName?.message}
                    startIcon={<Person fontSize="small" />}
                />
            </Box>

            <Box sx={{ mt: 2, mb: 2 }}>
                <CommonTextField
                    name="phoneNumber"
                    control={control}
                    type="tel"
                    errors={errors}
                    helperText={errors.phoneNumber?.message}
                    startIcon={<Phone fontSize="small" />}
                    placeholder="+91 XXXXXXXXXX"
                />
            </Box>

            <Box sx={{ mt: 2, mb: 2 }}>
                <CommonTextField
                    name="email"
                    control={control}
                    placeholder="Email Address"
                    errors={errors}
                    helperText={errors.email?.message}
                    startIcon={<Email fontSize="small" />}
                />
            </Box>

            <Box sx={{ mt: 2, mb: 2 }}>
                <CommonTextField
                    name="password"
                    control={control}
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    errors={errors}
                    helperText={errors.password?.message}
                    startIcon={<Lock fontSize="small" />}
                    endIcon={
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    }
                />
            </Box>

            <Box sx={{ mt: 2, mb: 2 }}>
                <CommonTextField
                    name="confirmPassword"
                    control={control}
                    placeholder="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    errors={errors}
                    helperText={errors.confirmPassword?.message}
                    startIcon={<Lock fontSize="small" />}
                    endIcon={
                        <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                        >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    }
                />
            </Box>

            <CommonButton
                fullWidth
                type="submit"
                disabled={!isValid}
                sx={{ mt: 3, mb: 2 }}
            >
                Sign Up
            </CommonButton>
        </form>
    );
};

