import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import cafe1 from "../../assets/cafe1.jpg";
import cafe_logo from "../../assets/cafe_logo.png";
import { API_ROUTES } from "../../utils/api_constants";
import { usePost } from "../../utils/hooks/api_hooks";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { CommonButton } from "../../components/common/commonButton";

export const Plan = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const signupData = JSON.parse(localStorage.getItem("signupData"));

  const [isLoading, setIsLoading] = useState(false);

  // Plan details
  const plan = {
    name: "Premium Plan",
    price: "₹10",
    priceNumeric: 10,
    features: [
      "Manage orders in real time with live status updates (Pending, Accepted, Completed).",
      "Centralized menu and category management for fast updates across outlets.",
      "QR-powered table ordering and digital dine-in experience.",
      "Payment status tracking and order history with export support.",
      "Dashboard analytics for sales, order volume, and business performance.",
      "Layout and table management for smoother floor operations.",
      "No hardware lock-in, no complex setup, and accessible from anywhere.",
    ],
  };

  const { mutate: createOrder, isPending: createOrderPending } = usePost(
    API_ROUTES.createOrder,
    {
      onSuccess: (res) => {
        const order = res.result;

        const razorpayOptions = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          name: "Aeternis",
          description: "Premium Plan Subscription",
          image: "/cafe_logo",
          handler: (response) => {
            setIsLoading(false);
            handlePaymentSuccess(response);
          },
          prefill: {
            name: signupData?.name,
            email: signupData?.email,
          },
          theme: { color: "#6F4E37" },
          modal: {
            ondismiss: () => {
              setIsLoading(false);
              toast.info("Payment cancelled");
            },
          },
        };

        const razorpayInstance = new window.Razorpay(razorpayOptions);
        razorpayInstance.open();
      },
      onError: (error) => {
        setIsLoading(false);
        toast.error(error);
      },
    },
  );

  // API call to create admin user after payment
  const { mutate: verifySignup } = usePost(
    API_ROUTES.verifySignup, // New endpoint
    {
      onSuccess: async (res) => {
        localStorage.removeItem("signupData");
        await login(res.result.token);
        toast.success("Logged in successfully!!");
      },
      onError: (error) => {
        toast.error(error || "Failed to complete signup.");
      },
    },
  );

  const handlePaymentSuccess = (response) => {
    // Create admin user with payment details
    verifySignup({
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      email: signupData.email,
      password: signupData.password,
      phoneNumber: signupData.phoneNumber,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
    });
  };

  const handleContinue = () => {
    if (!window.Razorpay) {
      toast.error("Payment gateway not loaded. Please refresh the page.");
      return;
    }
    setIsLoading(true);
    createOrder({ amount: plan.priceNumeric });
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!signupData) {
    return; // Prevent rendering if no signup data
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
          maxWidth: 600,
          borderRadius: 4,
          mt: 4,
          mb: 4,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(50px)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="700"
          textAlign="center"
          sx={{
            color: "#3E2723",
            fontFamily: "'Playfair Display', serif",
            mb: 2,
          }}
        >
          Be a Member
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          sx={{ color: "#5D4037", mb: 4 }}
        >
          Join with our premium services ☕
        </Typography>

        {/* Plan Card */}
        <Paper
          elevation={5}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: "#F5EFE6",
            border: "2px solid #6F4E37",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ color: "#3E2723", mb: 1 }}
          >
            {plan.name}
          </Typography>
          <Typography variant="h6" sx={{ color: "#6F4E37", mb: 2 }}>
            {plan.price}/month
          </Typography>
          <List>
            {plan.features.map((feature, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircle sx={{ color: "#6F4E37", fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary={feature}
                  sx={{ color: "#5D4037" }}
                  primaryTypographyProps={{ fontSize: "0.9rem" }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* User Info Preview */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: "#FFF3E0", borderRadius: 2 }}>
          <Typography variant="body2" sx={{ color: "#5D4037", mb: 0.5 }}>
            <strong>Name:</strong> {signupData?.firstName}{" "}
            {signupData?.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: "#5D4037" }}>
            <strong>Email:</strong> {signupData?.email}
          </Typography>
        </Box>

        <CommonButton
          fullWidth
          variant="contained"
          onClick={handleContinue}
          loading={isLoading}
          sx={{
            mt: 4,
          }}
        >
          {`Continue to Payment • ${plan.price}`}
        </CommonButton>

        <CommonButton
          fullWidth
          variant="text"
          onClick={() => navigate(-1)}
          sx={{
            mt: 2,
          }}
        >
          ← Back to Signup
        </CommonButton>
      </Paper>
    </Box>
  );
};
