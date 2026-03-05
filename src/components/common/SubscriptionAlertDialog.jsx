import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import cafeLogo from "../../assets/cafe_logo.png";
import { queryClient } from "../../lib/queryClient";
import { API_ROUTES } from "../../utils/api_constants";
import { usePost } from "../../utils/hooks/api_hooks";
import { CommonButton } from "./commonButton";

export const SubscriptionAlertDialog = ({ user, alert, onLogout }) => {
  const isExpired = alert?.type === "expired";
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isExpired) {
      setIsOpen(true);
      return;
    }
    setIsOpen(Boolean(alert));
  }, [alert, isExpired]);

  const title = useMemo(() => {
    if (isExpired) return "Subscription Expired";
    if (alert?.type === "expiring_soon") return "Subscription Expiring Soon";
    return "Subscription Alert";
  }, [alert, isExpired]);

  const closeDialog = () => {
    if (isExpired) return;
    setIsOpen(false);
  };

  const { mutate: verifyRenewSubscription, isPending: verifyPending } = usePost(
    API_ROUTES.verifyRenewSubscription,
    {
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: "get-me" });
        toast.success("Subscription renewed successfully.");
      },
      onError: (error) => {
        toast.error(error || "Renewal verification failed.");
      },
    },
  );

  const handleRazorpaySuccess = (response) => {
    verifyRenewSubscription({
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_subscription_id: response.razorpay_subscription_id,
      razorpay_signature: response.razorpay_signature,
    });
  };

  const openRazorpayCheckout = (subscriptionId) => {
    if (!window.Razorpay) {
      toast.error("Payment gateway not loaded.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      subscription_id: subscriptionId,
      name: "Aeternis",
      image: cafeLogo,
      description: "Renew subscription",
      prefill: {
        name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        email: user?.email,
        contact: user?.phoneNumber ? String(user.phoneNumber) : "",
      },
      theme: { color: "#6F4E37" },
      handler: handleRazorpaySuccess,
      modal: {
        ondismiss: () => {
          if (isExpired) {
            setIsOpen(true);
          }
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const { mutate: renewSubscription, isPending: renewPending } = usePost(
    API_ROUTES.renewSubscription,
    {
      onSuccess: (res) => {
        const subscriptionId = res?.result?.id;
        if (!subscriptionId) {
          toast.error("Subscription ID missing.");
          return;
        }
        openRazorpayCheckout(subscriptionId);
      },
      onError: (error) => {
        toast.error(error || "Unable to start renewal.");
      },
    },
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!alert) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={(_, reason) => {
        if (
          isExpired &&
          (reason === "backdropClick" || reason === "escapeKeyDown")
        ) {
          return;
        }
        closeDialog();
      }}
      disableEscapeKeyDown={isExpired}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {alert?.message || "Please renew your subscription to continue."}
        </Typography>
      </DialogContent>
      <DialogActions>
        {!isExpired && (
          <CommonButton variant="outlined" onClick={closeDialog}>
            Dismiss
          </CommonButton>
        )}
        {isExpired && (
          <CommonButton variant="outlined" onClick={onLogout}>
            Logout
          </CommonButton>
        )}
        <CommonButton
          onClick={() => renewSubscription({})}
          loading={renewPending || verifyPending}
        >
          Renew Now
        </CommonButton>
      </DialogActions>
    </Dialog>
  );
};
