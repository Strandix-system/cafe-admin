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

export default function Dashboard() {
  const navigate = useNavigate();
  const { role, logout, isSuperAdmin, isAdmin } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stats");
  const [statsData, setStatsData] = useState(null);

  const {
    data: superAdminStats,
    isLoading: isStatsLoading,
    isError,
  } = useFetch("getMe", API_ROUTES.superAdminStats, {}, {
    enabled: isSuperAdmin,
    onSuccess: (res) => {
      setStatsData(res.result);
    },
    onError: (error) => {
      console.error("Failed to fetch super admin stats", error);
    },
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

const stats = isSuperAdmin
  ? getSuperAdminStats(statsData)
  : isAdmin
  ? getAdminStats(statsData)
  : [];

  return (
    <Box
      display="flex"
      bgcolor="#FAF7F2"
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #e0e7ff 100%)",
        p: { xs: 2, md: 4 },
      }}
    >
      {/* ================= SIDEBAR (SUPER ADMIN) ================= */}
      {isSuperAdmin && (
        <Box
          width={260}
          bgcolor="#6F4E37"
          color="white"
          p={3}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h6" fontWeight={700} mb={4}>
              ☕ Super Admin
            </Typography>

            <Stack spacing={1}>
              {(isSuperAdmin ? sideBarItems.superAdmin : sideBarItems.admin).map((item) => {
                const Icon = item.icon;

                return (
                  <Sidebar
                    key={item.key}
                    icon={<Icon />}
                    label={item.label}
                    active={activeTab === item.tab}
                    onClick={() => setActiveTab(item.tab)}
                  />
                );
              })}
            </Stack>
          </Box>
          <Stack spacing={1}>
            {sideBarItems.common.map((item) => {
              const Icon = item.icon;

              return (
                <Sidebar
                  key={item.key}
                  icon={<Icon />}
                  label={item.label}
                  active={false}
                  onClick={handleLogout} // 🔥 logout handler
                />
              );
            })}
          </Stack>

        </Box>
      )}

      <Box maxWidth="1600px" mx="auto" display="flex" flexDirection="column" gap={4}>
        {/* HEADER */}
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom color="#4B2E2B">
            {isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard"}
          </Typography>

          <Typography color="text.secondary">
            {isSuperAdmin
              ? "Platform-wide insights across all cafes"
              : "Your cafe performance overview"}
          </Typography>
        </Box>

        {/* STATS */}
        {isSuperAdmin && (
          <Box width="100%">
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

        {isSuperAdmin && activeTab === "admins" && <AdminList />}

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

