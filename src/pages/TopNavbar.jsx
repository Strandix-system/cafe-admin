// TopNavbar.jsx - With conditional back button
import { useState } from "react";
import {
    Box,
    IconButton,
    Avatar,
    Typography,
    Badge,
    Menu,
    MenuItem,
    Divider,
    Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {CommonButton} from "../components/common/commonButton";

export function TopNavbar() {
    const { user, logout, isSuperAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);

    // Routes that should show the back button
    const showBackButtonRoutes = [
        "/cafe/create-edit",
        "/layouts/create-edit",
        "/cafe/view-customers/",
        "/categories/create",
        "/order-history",
        "/profile",
        "/my-orders"
    ];

    // Check if current route should show back button
    const shouldShowBackButton = showBackButtonRoutes.some((route) =>
        location.pathname.includes(route),
    );

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
        navigate("/");
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Get user initials for avatar
    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <Box
            sx={{
                height: 70,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 4,
                bgcolor: "white",
                borderBottom: "1px solid #e0e0e0",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                width: "100%",
            }}
        >
            {/* Left Side - Back Button (conditional) + Page Title */}
            <Box display="flex" alignItems="center" gap={2}>
                {/* {shouldShowBackButton && (
                    <Button
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: "#6F4E37",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": {
                                bgcolor: "#F5EFE6",
                            },
                        }}
                    >
                        Back
                    </Button>
                )} */}
                {shouldShowBackButton && (
                    <CommonButton
                        variant="text"
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: "#6F4E37",
                            "&:hover": {
                                backgroundColor: "#F5EFE6",
                            },
                        }}
                    >
                        Back
                    </CommonButton>
                )}

            </Box>

            {/* Right Side - Actions & Profile */}
            <Box display="flex" alignItems="center" gap={2}>
                {/* Divider */}
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                {/* User Profile */}
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    sx={{
                        cursor: "pointer",
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 2,
                        transition: "background-color 0.2s",
                        "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                    onClick={handleMenuOpen}
                >
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: isSuperAdmin ? "#5B4CFF" : "#6F4E37",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                        }}
                    >
                        {getInitials(user?.name || user?.email)}
                    </Avatar>

                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                            {user?.name || "User"}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            lineHeight={1.2}
                        >
                            {isSuperAdmin ? "Super Admin" : "Admin"}
                        </Typography>
                    </Box>
                </Box>

                {/* Profile Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    PaperProps={{
                        sx: {
                            mt: 1.5,
                            minWidth: 200,
                            borderRadius: 2,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        },
                    }}
                >
                    {!isSuperAdmin && (
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                navigate("/profile");
                            }}
                            sx={{ gap: 1.5, py: 1.5 }}
                        >
                            <PersonIcon fontSize="small" />
                            <Typography variant="body2">My Profile</Typography>
                        </MenuItem>)}

                    <Divider sx={{ my: 1 }} />

                    <MenuItem
                        onClick={handleLogout}
                        sx={{ gap: 1.5, py: 1.5, color: "error.main" }}
                    >
                        <LogoutIcon fontSize="small" />
                        <Typography variant="body2">Logout</Typography>
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}
