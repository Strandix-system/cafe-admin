import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box, Stack, Button, Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

import AdminList from "../AdminList";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";
import { sideBarItems } from "../../configs/sideBarItems";
import { getSuperAdminStats, getAdminStats } from "../../configs/statsItems";

import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { useNavigate } from "react-router-dom";
import LayoutsPage from "../LayoutsPage";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";

const HEADER_CONFIG = {
  stats: {
    title: "Super Admin Dashboard",
    subtitle: "Platform-wide insights across all cafes",
  },
  admins: {
    title: "Admin Management",
    subtitle: "Create, update and manage cafe admins",
  },
  layouts: {
    title: "Layout Builder",
    subtitle: "Design and manage cafe website layouts",
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { role, logout, isSuperAdmin, isAdmin } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stats");
  const [statsData, setStatsData] = useState(null);

  const header = isSuperAdmin
    ? HEADER_CONFIG[activeTab]
    : {
        title: "Admin Dashboard",
        subtitle: "Your cafe performance overview",
  };

  const {
    data: superAdminStats,
    isLoading: isStatsLoading,
    isError,
  } = useFetch("get-me", API_ROUTES.superAdminStats, {}, {
    enabled: isSuperAdmin,
    onSuccess: (res) => {
      queryClient.invalidateQueries({queryKey:["get-me"]});
      setStatsData(res.result);
    },
    onError: (error) => {
      console.error("Failed to fetch super admin stats", error);
    },
  });

  // ===== ADMIN STATS =====
  const { data: adminStats } = useFetch(
    "admin-stats",
    API_ROUTES.adminStats,
    {},
    {
      enabled: isAdmin,
      onSuccess: (res) => setStatsData(res.result),
    }
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

const stats = isSuperAdmin
  ? getSuperAdminStats(superAdminStats)
  : isAdmin
  ? getAdminStats(adminStats)
  : [];

   // --------- ROLE BASED SIDEBAR ITEMS ----------
  const sidebarMenu = isSuperAdmin
    ? sideBarItems.superAdmin
    : sideBarItems.admin;

  return (
    <Box
      display="flex"
      bgcolor="#FAF7F2"
      overflow="hidden"
      sx={{
        height: "100vh",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #e0e7ff 100%)",
      }}
    >
      {/* ================= SIDEBAR (SUPER ADMIN) ================= */}

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
          {/* ===== TOP SECTION ===== */}
          <Box>
            {/* Header */}
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              px={2}
              py={2}
            >
              <IconButton
                onClick={() => setSidebarOpen(prev => !prev)}
                sx={{ color: "white" }}
              >
                <MenuIcon />
              </IconButton>

              {sidebarOpen && (
                <Typography
                  variant="h6"
                  fontWeight={700}
                  noWrap
                >
                  {isSuperAdmin ? "Super Admin" : "Admin"}
                </Typography>
              )}
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 1 }} />

            {/* Menu Items */}
            <Stack spacing={0.5} px={1}>
              {sidebarMenu.map((item) => {
                const Icon = item.icon;

                return (
                  <Sidebar
                    key={item.key}
                    icon={<Icon />}
                    label={item.label}
                    active={activeTab === item.tab}
                    collapsed={!sidebarOpen}
                    onClick={() => setActiveTab(item.tab)}
                  />
                );
              })}
            </Stack>
          </Box>

          {/* ===== FOOTER ===== */}
          <Box px={1} pb={2}>
            <Sidebar
              icon={<LogoutIcon />}
              label="Logout"
              collapsed={!sidebarOpen}
              onClick={handleLogout}
            />
          </Box>
        </Box>
      


      <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
        {/* HEADER */}
        <Box px={4} py={3} flexShrink={0}>
          <Typography variant="h4" fontWeight={700}>
            {header.title}
          </Typography>

          <Typography color="text.secondary">
            {header.subtitle}
          </Typography>
          
        </Box>

        {/* STATS */}
        {activeTab === "stats" && (
          <Box flex={1}
            px={4}
            pb={4}
            sx={{
              overflowY: "auto",
              scrollBehavior: "smooth",
            }} >
          <Grid container spacing={3}>
            {stats.map((stat) => (
              <Grid item xs={12} sm={6} md={4} key={stat.label}>
                <StatCard
                  label={stat.label}
                  value={stat.value}
                  loading={isLoading}
                />
              </Grid>
            ))}
          </Grid>
          </Box>

        )}

        {isSuperAdmin && activeTab === "admins" && (
          <Box height="100%" overflow="auto">
            <AdminList />
          </Box>
        )}

        {isSuperAdmin && activeTab === "layouts" && (
          <Box height="100%" overflow="auto">
            <LayoutsPage />
          </Box>
        )}
          
        {/* ADMIN PLACEHOLDER */}
        {isAdmin && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600}>
                Admin dashboard stats coming soon
              </Typography>
              <Typography color="text.secondary">
                Menu performance, orders, earnings & layout analytics will appear here.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}

