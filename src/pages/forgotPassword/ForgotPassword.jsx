import { useState } from "react";
import {
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Link,
  Alert,
} from "@mui/material";
import { Email, ArrowBack, CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import cafe1 from "../../assets/cafe1.jpg";
import {InputField} from "../../components/common/InputField";
import { usePost } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import {CommonButton} from "../../components/common/commonButton";

const emailSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const values = watch();

  const { mutate: sendResetLink, isPending } = usePost(
    API_ROUTES.forgotPassword,
    {
      onSuccess: () => {
        setEmailSent(true);
        toast.success("Password reset link sent to your email!");
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const onSubmit = (data) => {
    sendResetLink(data);
  };

  const handleResend = () => {
    sendResetLink({ email: values?.email });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        backgroundImage: `linear-gradient(
          rgba(62,39,35,0.75),
          rgba(62,39,35,0.75)
        ), url(${cafe1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(50px)",
        }}
      >
        {!emailSent ? (
          <>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                fontWeight="700"
                sx={{
                  color: "#3E2723",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Forgot Password?
              </Typography>

              <Typography variant="body2" sx={{ color: "#5D4037", mt: 1 }}>
                No worries, we'll send a reset link ☕
              </Typography>
            </Box>

            {/* Email Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <InputField
                  field={register("email")}
                  label="Email Address"
                  error={errors.email}
                  helperText={
                    errors.email?.message ||
                    "Enter the email associated with your account"
                  }
                  startIcon={<Email fontSize="small" />}
                />
              </Box>

              <CommonButton
                type="submit"
                fullWidth
                loading={isPending}
                disabled={!isValid}
                sx={{ mt: 3, mb: 2 }}
              >
                Send Reset Link
              </CommonButton>

            </form>
          </>
        ) : (
          <>
            {/* Success State */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <CheckCircle
                sx={{
                  fontSize: 64,
                  color: "#6F4E37",
                }}
              />
            </Box>

            <Typography
              variant="h5"
              fontWeight="700"
              sx={{
                color: "#3E2723",
                fontFamily: "'Playfair Display', serif",
                mb: 2,
              }}
            >
              Check Your Email
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "#5D4037", mb: 3, lineHeight: 1.6 }}
            >
              We've sent a password reset link to
              <br />
              <strong>{values?.email}</strong>
            </Typography>

            <Alert
              severity="info"
              sx={{
                mb: 3,
                textAlign: "left",
                backgroundColor: "#FFF3E0",
                color: "#5D4037",
                "& .MuiAlert-icon": {
                  color: "#6F4E37",
                },
              }}
            >
              Click the link in the email to reset your password.
            </Alert>

            {/* Resend Link */}
            <Typography variant="body2" sx={{ color: "#5D4037", mb: 2 }}>
              Didn't receive the email?{" "}
              <Link
                component="button"
                type="button"
                onClick={handleResend}
                disabled={isPending}
                sx={{
                  color: "#6F4E37",
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Resend
              </Link>
            </Typography>
          </>
        )}

        {/* Single Back to Login button for both states */}
        <CommonButton
          fullWidth
          variant="outlined"
          onClick={() => navigate("/login")}
          sx={{ mt: 2, py: 1.2, fontSize: "0.95rem" }}
        >
          <ArrowBack fontSize="small" style={{ marginRight: 8 }} />
          Back to Login
        </CommonButton>
      </Paper>
    </Box>
  );
};

