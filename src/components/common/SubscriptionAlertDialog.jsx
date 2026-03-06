import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
} from "@mui/material";
import toast from "react-hot-toast";
import cafeLogo from "../../assets/cafe_logo.png";
import { queryClient } from "../../lib/queryClient";
import { API_ROUTES } from "../../utils/api_constants";
import { usePost } from "../../utils/hooks/api_hooks";
import { CommonButton } from "./commonButton";

export const SubscriptionAlertDialog = ({ user, alert }) => {
  const isExpired = alert?.type === "expired";
  const isExpiringSoon = alert?.type === "expiringSoon";

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!alert) {
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
  }, [alert]);

  // Reload Razorpay script once on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const title = useMemo(() => {
    if (isExpired) return "Subscription Expired";
    if (isExpiringSoon) return "Subscription Expiring Soon";
    return "Subscription Alert";
  }, [isExpired, isExpiringSoon]);

  const alertSeverity = isExpired ? "error" : "warning";

  const closeDialog = () => {
    if (alert?.modalClosable === false) return; // Block closing if expired
    setIsOpen(false);
  };

  // Step 2: Verify payment with backend
  const { mutate: verifyRenewSubscription, isPending: verifyPending } = usePost(
    API_ROUTES.verifyRenewSubscription,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: "get-me" });
        toast.success("Subscription renewed successfully.");
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error(error);
      },
    },
  );

  // Step 1b: Open Razorpay checkout with subscription ID
  const openRazorpayCheckout = (subscriptionId) => {
    if (!window.Razorpay) {
      toast.error("Payment gateway not loaded. Please try again.");
      return;
    }

    const rzp = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      subscription_id: subscriptionId,
      name: "Aeternis",
      image: cafeLogo,
      description: "Renew Subscription",
      prefill: {
        name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        email: user?.email,
        contact: user?.phoneNumber ? String(user.phoneNumber) : "",
      },
      theme: { color: "#6F4E37" },
      handler: ({
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
      }) => {
        verifyRenewSubscription({
          razorpay_payment_id,
          razorpay_subscription_id,
          razorpay_signature,
        });
      },
      modal: {
        // Re-open dialog if user dismisses payment on expired state
        ondismiss: () => isExpired && setIsOpen(true),
      },
    });

    rzp.open();
  };

  // Step 1a: Initiate renewal → get subscription ID
  const { mutate: renewSubscription, isPending: renewPending } = usePost(
    API_ROUTES.renewSubscription,
    {
      onSuccess: (res) => {
        const subscriptionId = res?.result?.id;
        if (!subscriptionId) {
          toast.error("Subscription ID missing in response.");
          return;
        }
        openRazorpayCheckout(subscriptionId);
      },
      onError: (error) => {
        toast.error(error);
      },
    },
  );

  if (!alert) return null;

  const isLoading = renewPending || verifyPending;

  return (
    <Dialog
      open={isOpen}
      onClose={(_, reason) => {
        // Prevent closing by backdrop/escape when expired
        if (
          alert?.modalClosable === false &&
          (reason === "backdropClick" || reason === "escapeKeyDown")
        )
          return;
        closeDialog();
      }}
      disableEscapeKeyDown={alert?.modalClosable === false}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Alert severity={alertSeverity} sx={{ mb: 1.5 }}>
          {alert?.message}
        </Alert>

        {isExpired && (
          <Typography variant="body2" color="text.secondary">
            Your access has been suspended. Renew now to restore full access.
          </Typography>
        )}

        {isExpiringSoon && (
          <Typography variant="body2" color="text.secondary">
            Renew early to avoid any interruption to your service.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        {!isExpired && (
          <CommonButton
            variant="outlined"
            onClick={closeDialog}
            disabled={isLoading}
          >
            Dismiss
          </CommonButton>
        )}
        <CommonButton
          onClick={() => renewSubscription({})}
          loading={isLoading}
          disabled={isLoading}
        >
          Renew Now
        </CommonButton>
      </DialogActions>
    </Dialog>
  );
};
