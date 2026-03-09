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
import { API_ROUTES } from "../../utils/api_constants";
import { useFetch, usePost } from "../../utils/hooks/api_hooks";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { CommonButton } from "../../components/common/commonButton";
import { openRazorpayCheckout } from "../../utils/razorpayUtils";

export const Plan = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const signupData = JSON.parse(localStorage.getItem("signupData"));

  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  // Plan details
  const planFeatures = {
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

  const formatBillingText = (interval, period) => {
    if (interval === 1) return `Renews every ${period}`;
    return `Renews every ${interval} ${period}s`;
  };

  const { data: plansData, isLoading: plansLoading } = useFetch(
    "plans",
    API_ROUTES.getPlans,
  );
  const plans = plansData?.result ?? [];

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);

  const handleSubscription = (subscriptionId) => {
    openRazorpayCheckout({
      subscriptionId, // dynamic
      user: signupData, // { firstName, lastName, email, phoneNumber }
      description: "Premium Plan Subscription",
      onSuccess: (response) => {
        setIsLoading(false);
        handleSubscriptionSuccess(response);
      },
      onDismiss: () => {
        setIsLoading(false);
        toast.info("Payment cancelled");
      },
    });
  };

  const { mutate: createSubscription } = usePost(
    API_ROUTES.createSubscription,
    {
      onSuccess: (res) => {
        const { subscription } = res.result;
        handleSubscription(subscription.id);
      },
      onError: (error) => {
        setIsLoading(false);
        toast.error(error);
      },
    },
  );
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

  const handleSubscriptionSuccess = (response) => {
    console.log("Subscription payment successful:", response);
    verifySignup({
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      email: signupData.email,
      password: signupData.password,
      phoneNumber: signupData.phoneNumber,

      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_subscription_id: response.razorpay_subscription_id,
      razorpay_signature: response.razorpay_signature,
    });
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (plans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(plans[0].id);
    }
  }, [plans, selectedPlanId]);

  const handleContinue = () => {
    if (!window.Razorpay) {
      toast.error("Payment gateway not loaded.");
      return;
    }

    if (!selectedPlan) {
      toast.error("Please select a plan.");
      return;
    }

    setIsLoading(true);

    createSubscription({
      planId: selectedPlanId,
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      email: signupData.email,
      phoneNumber: signupData.phoneNumber,
    });
  };

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

        {plans.map((plan) => {
          const amount = plan.item.amount / 100;
          return (
            <Paper
              key={plan.id}
              elevation={5}
              onClick={() => setSelectedPlanId(plan.id)}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor:
                  selectedPlanId === plan.id ? "#E8D8C3" : "#F5EFE6",
                border:
                  selectedPlanId === plan.id
                    ? "2px solid #3E2723"
                    : "2px solid #6F4E37",
                cursor: "pointer",
                mb: 2,
              }}
            >
              <Typography
                variant="h5"
                fontWeight="600"
                sx={{ color: "#3E2723", mb: 1 }}
              >
                {plan.item.name}
              </Typography>

              <Typography variant="h6" sx={{ color: "#6F4E37" }}>
                ₹{amount} / {plan.period}
              </Typography>

              <Typography variant="body2" sx={{ color: "#5D4037", mb: 2 }}>
                ₹{amount} charged today •{" "}
                {formatBillingText(plan.interval, plan.period)}
              </Typography>

              <List>
                {planFeatures.features.map((feature, index) => (
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
          );
        })}

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
          {`Continue to Payment • ₹${selectedPlan?.item.amount / 100 || ""}`}
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
