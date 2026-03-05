import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Tabs, Tab } from "@mui/material";

export function ProfileLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const activeTab = location.pathname.includes("change-password")
        ? "change-password"
        : "";

    return (
        <>
            <Box sx={{ px: 3, mb: 2 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, value) => navigate(value)}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{
                        "& .MuiTab-root": {
                            fontWeight: 600,
                            textTransform: "none",
                        },
                    }}
                >
                    <Tab label="Update Profile" value="" />
                    <Tab label="Change Password" value="change-password" />
                </Tabs>
            </Box>

            <Outlet />
        </>
    );
}
