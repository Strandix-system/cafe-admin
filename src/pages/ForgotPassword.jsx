import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  InputAdornment,
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
import cafe1 from "../assets/cafe1.jpg";
import { usePost } from "../utils/hooks/api_hooks";
import { API_ROUTES } from "../utils/api_constants";

const emailSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: sendResetLink, isPending } = usePost(
    API_ROUTES.forgotPassword,
    {
      onSuccess: () => {
        setEmailSent(true);
        toast.success("Password reset link sent to your email!");
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message ||
          "Failed to send reset link. Please try again."
        );
      },
    }
  );

  const onSubmit = (data) => {
    setSubmittedEmail(data.email);
    sendResetLink(data);
  };

  const handleResend = () => {
    sendResetLink({ email: submittedEmail });
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
              <TextField
                fullWidth
                label="Email Address"
                margin="normal"
                {...register("email")}
                error={!!errors.email}
                helperText={
                  errors.email?.message ||
                  "Enter the email associated with your account"
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#F5EFE6",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
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
                  "&:hover": {
                    backgroundColor: "#5D4037",
                  },
                }}
              >
                {isPending ? (
                  <CircularProgress size={26} color="inherit" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
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
              <strong>{submittedEmail}</strong>
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
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate("/login")}
          sx={{
            mt: 2,
            py: 1.2,
            borderRadius: 3,
            textTransform: "none",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#6F4E37",
            borderColor: "#6F4E37",
            "&:hover": {
              borderColor: "#5D4037",
              backgroundColor: "rgba(111, 78, 55, 0.04)",
            },
          }}
        >
          <ArrowBack fontSize="small" sx={{ mr: 1 }} />
          Back to Login
        </Button>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;