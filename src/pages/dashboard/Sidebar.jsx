// Sidebar.jsx
import { useState, useEffect } from "react";
import { Box, Typography, Divider, Stack, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { sideBarItems } from "../../configs/sideBarItems";

export default function Sidebar() {
  const { isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarMenu = isSuperAdmin
    ? sideBarItems.superAdmin
    : sideBarItems.admin;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const isActiveItem = (itemPath) => {
    return location.pathname === itemPath;
  };

  return (
    <Box
      height="100vh"
      bgcolor="#6F4E37"
      color="white"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      flexShrink={0}
      sx={{
        width: sidebarOpen ? 260 : 80,
        transition: "width 0.3s ease",
      }}
    >
      <Box>
        <Box display="flex" alignItems="center" gap={1} px={2} py={2}>
          <IconButton
            onClick={() => setSidebarOpen((prev) => !prev)}
            sx={{ color: "white" }}
          >
            <MenuIcon />
          </IconButton>

          {sidebarOpen && (
            <Typography variant="h6" fontWeight={700} noWrap>
              {isSuperAdmin ? "Super Admin" : "Admin"}
            </Typography>
          )}
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 1 }} />

        <Stack spacing={0.5} px={1}>
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveItem(item.path);

            return (
              <Box
                key={item.key}
                onClick={() => handleMenuClick(item.path)}
                display="flex"
                alignItems="center"
                gap={sidebarOpen ? 2 : 0}
                justifyContent={sidebarOpen ? "flex-start" : "center"}
                px={sidebarOpen ? 2 : 1}
                py={1.25}
                borderRadius={2}
                sx={{
                  cursor: "pointer",
                  bgcolor: isActive ? "rgba(255,255,255,0.25)" : "transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: isActive
                      ? "rgba(255,255,255,0.3)"
                      : "rgba(255,255,255,0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Icon />
                </Box>
                {sidebarOpen && (
                  <Typography
                    fontWeight={isActive ? 600 : 500}
                    sx={{
                      transition: "font-weight 0.2s ease",
                    }}
                  >
                    {item.label}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
