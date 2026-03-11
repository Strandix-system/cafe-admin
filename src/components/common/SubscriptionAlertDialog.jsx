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
import { RAZORPAY_SRC } from "../../utils/razorpayUtils";

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
    script.src = RAZORPAY_SRC;
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const title = useMemo(() => {
    return isExpired ? "Subscription Expired" : "Subscription Expiring Soon";
  }, [isExpired]);

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
        toast.error(error?.message);
      },
    },
  );

  // Step 1b: Open Razorpay checkout with subscription ID
  const handleRenewSubscription = (subscriptionId) => {
    openRazorpayCheckout({
      subscriptionId, // dynamic
      user: user,
      description: "Renew Subscription",
      onSuccess: ({
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
      onDismiss: () => {
        // Optional: re-open modal for expired subscription
        if (isExpired) setIsOpen(true);
      },
      isExpired: isExpired, // optional
    });
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
        handleRenewSubscription(subscriptionId);
      },
      onError: (error) => {
        toast.error(error?.message);
      },
    },
  );

  if (!alert) return;

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

        <p className="text-sm text-gray-500">
          {isExpired
            ? "Your access has been suspended. Renew now to restore full access."
            : isExpiringSoon
              ? "Renew early to avoid any interruption to your service."
              : ""}
        </p>
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
