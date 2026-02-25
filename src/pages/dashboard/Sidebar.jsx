// Sidebar.jsx
import { useState, useEffect } from "react";
import { Box, Typography, Divider, Stack, IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { sideBarItems } from "../../configs/sideBarItems";

export function Sidebar() {
  const { isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Detect screen size changes
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg')); // >= 1200px
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md')); // >= 900px

  const [sidebarOpen, setSidebarOpen] = useState(isLargeScreen);

  // Automatically adjust sidebar based on screen size
  useEffect(() => {
    if (isLargeScreen) {
      setSidebarOpen(true); // Always open on large screens
    } else if (isMediumScreen) {
      setSidebarOpen(false); // Collapsed on medium screens
    } else {
      setSidebarOpen(false); // Collapsed on small screens
    }
  }, [isLargeScreen, isMediumScreen]);

  const sidebarMenu = isSuperAdmin
    ? sideBarItems.superAdmin
    : sideBarItems.admin;

  const handleMenuClick = (path) => {
    navigate(path);
    if (!isMediumScreen) {
      setSidebarOpen(false);
    }
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
        ...((!isMediumScreen && sidebarOpen) && {
          position: 'fixed',
          zIndex: theme.zIndex.drawer,
          boxShadow: theme.shadows[8],
        }),
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
                    noWrap
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