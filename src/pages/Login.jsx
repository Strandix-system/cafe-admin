import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Link,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material"; // Requires @mui/icons-material
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import cafe1 from "../assets/cafe1.jpg";
import * as yup from "yup";

import { useAuth } from "../context/AuthContext";
import { API_ROUTES } from "../utils/api_constants";
import { usePost } from "../utils/hooks/api_hooks";
import toast from "react-hot-toast";
import { api_enums } from "../enums/api";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const { login } = useAuth();

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem(api_enums.JWT_ACCESS_TOKEN);
    if (token) {
      navigate("/dashboard");
    }
  }, []);
  const { mutate: loginMutate, isPending } = usePost(API_ROUTES.login, {
    onSuccess: async (res) => {
      await login(res.result.token);
      reset();
      toast.success("Logged in successfully!!");

      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Login Failed! Please try again.",
      );
      console.log(error);
    },
  });

  const onSubmit = (data) => loginMutate(data);

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
        {/* Logo or Brand Placeholder */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{ color: "#3E2723", fontFamily: "'Playfair Display', serif" }}
          >
            Login
          </Typography>

          <Typography variant="body2" sx={{ color: "#5D4037", mb: 2 }}>
            Brew your way into the dashboard ☕
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email Address"
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
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

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#F5EFE6",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
          >
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

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isPending || isValid}
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
              "Log In ☕"
            )}
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
