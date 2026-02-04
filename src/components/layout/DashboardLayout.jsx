import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";
import ProfileDialog from "../dialogs/ProfileDialog";
import { useState } from "react";

export default function DashboardLayout() {
    const [openProfile, setOpenProfile] = useState(false);

    return (
        <Box height="100vh" display="flex" flexDirection="column">
            <TopNavbar onProfileClick={() => setOpenProfile(true)} />
            <Box display="flex" flex={1}>
                <Sidebar />
                <Box flex={1} p={3}>
                    <Outlet />
                </Box>
            </Box>
            <ProfileDialog
                open={openProfile}
                onClose={() => setOpenProfile(false)}
            />
        </Box>
    );
}
