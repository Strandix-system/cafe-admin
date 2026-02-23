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
  Tabs,
  Tab,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Person } from "@mui/icons-material"; // Added Person for name field
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import cafe1 from "../assets/cafe1.jpg";
import * as yup from "yup";
import InputField from "../components/common/InputField";
import { useAuth } from "../context/AuthContext";
import { API_ROUTES } from "../utils/api_constants";
import { usePost } from "../utils/hooks/api_hooks";
import toast from "react-hot-toast";
import { api_enums } from "../enums/api";

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const signupSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], "Passwords must match").required("Confirm password is required"),
});

const LoginSignup = () => { // Renamed component to Auth for clarity
  const { login } = useAuth();

  const [tabValue, setTabValue] = useState(0); // 0 for Login, 1 for Signup
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For signup confirm password
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const navigate = useNavigate();

  // Separate forms for login and signup
  const loginForm = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const currentForm = tabValue === 0 ? loginForm : signupForm;
  const { register, handleSubmit, reset, formState: { errors, isValid } } = currentForm;

  useEffect(() => {
    const token = localStorage.getItem(api_enums.JWT_ACCESS_TOKEN);
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const { mutate: loginMutate, isPending: loginPending } = usePost(API_ROUTES.login, {
    onSuccess: async (res) => {
      await login(res.result.token);
      loginForm.reset();
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

  const { mutate: signupMutate, isPending: signupPending } = usePost(API_ROUTES.signup, {
    onSuccess: (res) => {
      signupForm.reset();
      toast.success("Account created successfully! Please log in.");
      setTabValue(0); // Switch to login tab
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Signup Failed! Please try again.",
      );
      console.log(error);
    },
  });

  const onSubmit = (data) => {
    if (tabValue === 0) {
      loginMutate(data);
    } else {
      navigate("/plans", { state: data });
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
        {/* Logo or Brand Placeholder */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{ color: "#3E2723", fontFamily: "'Playfair Display', serif" }}
          >
            {tabValue === 0 ? "Login" : "Signup"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#5D4037", mb: 2 }}>
            {tabValue === 0 ? "Brew your way into the dashboard ☕" : "Join the coffee community ☕"}
          </Typography>
        </Box>

        {/* Tabs for Login/Signup */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          sx={{ mb: 2 }}
        >
          <Tab label="Login" />
          <Tab label="Signup" />
        </Tabs>

        <form onSubmit={handleSubmit(onSubmit)}>
          {tabValue === 1 && ( // Signup fields
            <Box sx={{ mt: 2, mb: 2 }}>
              <InputField
                field={signupForm.register("name")}
                label="Full Name"
                error={signupForm.formState.errors.name}
                helperText={signupForm.formState.errors.name?.message}
                startIcon={<Person fontSize="small" />}
              />
            </Box>
          )}

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

          {tabValue === 1 && ( // Confirm password for signup
            <Box sx={{ mt: 2, mb: 2 }}>
              <InputField
                field={signupForm.register("confirmPassword")}
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                error={signupForm.formState.errors.confirmPassword}
                helperText={signupForm.formState.errors.confirmPassword?.message}
                startIcon={<Lock fontSize="small" />}
                endIcon={
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                }
              />
            </Box>
          )}

          {tabValue === 0 && ( // Remember me and forgot password only for login
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
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={!isValid}
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
            {tabValue === 0 ? (
              loginPending ? (
                <CircularProgress size={26} color="inherit" />
              ) : (
                "Log In ☕"
              )
            ) : signupPending ? (
              <CircularProgress size={26} color="inherit" />
            ) : (
              "Sign Up ☕"
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

export default LoginSignup;
