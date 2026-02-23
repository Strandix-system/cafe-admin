import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CommonButton from "../../components/common/commonButton";
import { AlertTriangle } from "lucide-react";

export default function CompleteProfileDialog() {
    const { isProfileComplete } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (isProfileComplete || location.pathname.startsWith("/profile")) return null;

    return (
        <Dialog
            open={true}
            disableEscapeKeyDown
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    maxWidth: 440,
                    width: "100%",
                    overflow: "hidden",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
                },
            }}
        >
            {/* Alert Header Banner */}
            <Box
                sx={{
                    bgcolor: "#B71C1C",
                    px: 3,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                }}
            >
                <AlertTriangle size={22} color="white" />
                <Typography
                    variant="subtitle1"
                    sx={{ color: "white", fontWeight: 700, letterSpacing: 0.5 }}
                >
                    Action Required
                </Typography>
            </Box>

            <DialogTitle
                sx={{
                    fontWeight: 700,
                    color: "#3E2723",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.3rem",
                    pt: 3,
                    pb: 0,
                    px: 3,
                }}
            >
                Complete Your Profile
            </DialogTitle>

            <DialogContent sx={{ px: 3, pt: 1.5, pb: 0 }}>
                <Typography variant="body2" sx={{ color: "#5D4037", mb: 2, lineHeight: 1.6 }}>
                    Your profile is incomplete. You must fill in all required details
                    before accessing the dashboard.
                </Typography>

                {/* Required fields list */}
                <Box
                    sx={{
                        bgcolor: "#FFF3E0",
                        border: "1px solid #FFCC80",
                        borderRadius: 2,
                        px: 2.5,
                        py: 2,
                        mb: 1,
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{ color: "#E65100", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}
                    >
                        Required Fields
                    </Typography>
                    <Box
                        component="ul"
                        sx={{ m: 0, mt: 1, pl: 2.5, display: "flex", flexDirection: "column", gap: 0.6 }}
                    >
                        {[
                            "Cafe Name & Contact info",
                            "Address, City, State & Pincode",
                            "Operating hours (weekdays & weekends)",
                            "Cafe logo & Profile image",
                            "GST Percentage",
                        ].map((item) => (
                            <li key={item}>
                                <Typography variant="body2" sx={{ color: "#5D4037" }}>
                                    {item}
                                </Typography>
                            </li>
                        ))}
                    </Box>
                </Box>

                <Typography
                    variant="caption"
                    sx={{ color: "#9E9E9E", display: "block", mt: 1.5, lineHeight: 1.5 }}
                >
                    ⚠ This dialog cannot be dismissed. All features will be unlocked once your profile is complete.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2.5 }}>
                <CommonButton
                    fullWidth
                    variant="contained"
                    onClick={() => navigate("/profile")}
                    sx={{
                        bgcolor: "#B71C1C",
                        "&:hover": { bgcolor: "#C62828" },
                        py: 1.2,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                    }}
                >
                    Complete Profile Now →
                </CommonButton>
            </DialogActions>
        </Dialog>
    );
}