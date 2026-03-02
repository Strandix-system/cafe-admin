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
import { CommonButton } from "../../components/common/commonButton";
import { AlertTriangle } from "lucide-react";

export function CompleteProfileDialog() {
    const { user, isSuperAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (isSuperAdmin || user.isProfileComplete || location.pathname.startsWith("/profile")) return;

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
                    Please fill in your details and update your profile to access the dashboard and all other features.
                </Typography>

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