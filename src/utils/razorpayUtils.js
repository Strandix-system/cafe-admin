import { toast } from "react-hot-toast";
import cafe_logo from "../assets/cafe_logo.png";

export const openRazorpayCheckout = ({
  subscriptionId,
  user,
  description,
  onSuccess,
  onDismiss,
  isExpired = false,
}) => {
  if (!window.Razorpay) {
    toast.error("Payment gateway not loaded. Please try again.");
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    subscription_id: subscriptionId,
    name: "Aeternis",
    image: cafe_logo,
    description,
    prefill: {
      name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      email: user?.email,
      contact: user?.phoneNumber ? String(user.phoneNumber) : "",
    },
    theme: { color: "#6F4E37" },
    handler: onSuccess,
    modal: {
      ondismiss: () => {
        if (typeof onDismiss === "function") onDismiss();
        if (isExpired) {
          toast.info("Payment cancelled. Please try again.");
        }
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
