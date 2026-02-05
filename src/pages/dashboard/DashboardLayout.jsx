// DashboardLayout.jsx
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import TopNavbar from "../TopNavbar";

export default function DashboardLayout({ children }) {
  return (
    <Box
      display="flex"
      height="100vh"
      width="100vw"
      overflow="hidden"
      sx={{ m: 0, p: 0 }}
    >
      <Sidebar />

      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        overflow="hidden"
        width="100%"
        sx={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #e0e7ff 100%)",
          m: 0,
          p: 0,
        }}
      >
        {/* Top Navbar - Fixed at top */}
        <TopNavbar />

        {/* Scrollable content area below navbar */}
        <Box
          flex={1}
          width="100%"
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
            m: 0,
            p: 0,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
