import { useEffect, useState } from "react";
import { Box, Typography, Paper, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import cafe1 from "../../assets/cafe1.jpg";
import { api_enums } from "../../enums/api";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const LoginSignup = () => {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(api_enums.JWT_ACCESS_TOKEN);
    if (token) navigate("/dashboard");
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        backgroundImage: `linear-gradient(rgba(62,39,35,0.75), rgba(62,39,35,0.75)), url(${cafe1})`,
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

        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          indicatorColor="primary"
          textColor="primary"
          centered
          sx={{ mb: 2 }}
        >
          <Tab label="Login" />
          <Tab label="Signup" />
        </Tabs>

        {tabValue === 0 ? <LoginForm /> : <SignupForm />}
      </Paper>
    </Box>
  );
};

export default LoginSignup;