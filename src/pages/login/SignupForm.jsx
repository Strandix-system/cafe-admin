import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Person, Phone } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "../../components/common/InputField";
import toast from "react-hot-toast";
import CommonButton from "../../components/common/commonButton";

const signupSchema = yup.object({
    name: yup.string().required("Name is required"),
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

const SignupForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        resolver: yupResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data) => {
        localStorage.setItem(
            "signupData",
            JSON.stringify({
                name: data.name,
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
            <Box sx={{ mt: 2, mb: 2 }}>
                <InputField
                    field={register("name")}
                    label="Full Name"
                    error={errors.name}
                    helperText={errors.name?.message}
                    startIcon={<Person fontSize="small" />}
                />
            </Box>

            <Box sx={{ mt: 2, mb: 2 }}>
                <InputField
                    field={register("phoneNumber")}
                    label="Phone Number"
                    type="tel"
                    error={errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    startIcon={<Phone fontSize="small" />}
                    placeholder="+91 XXXXXXXXXX"
                />
            </Box>

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

            <Box sx={{ mt: 2, mb: 2 }}>
                <InputField
                    field={register("confirmPassword")}
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    error={errors.confirmPassword}
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
                loading={isSubmitting}
                disabled={!isValid}
                sx={{ mt: 3, mb: 2 }}
            >
                Sign Up
            </CommonButton>
        </form>
    );
};

export default SignupForm;