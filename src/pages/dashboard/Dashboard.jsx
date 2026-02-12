import { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { getSuperAdminStats, getAdminStats } from "../../configs/statsItems";
import StatCard from "./StatCard";

export default function Dashboard() {
  const { isSuperAdmin, isAdmin } = useAuth();

  const { data: superAdminStatsData, isLoading: isSuperAdminLoading } = useFetch(
    "super-admin-stats",
    API_ROUTES.getStats,
    {},
    {
      enabled: isSuperAdmin,
    },
  );

  const { data: adminStatsData, isLoading: isAdminLoading } = useFetch(
    "admin-stats",
    API_ROUTES.getStats,
    {},
    {
      enabled: isAdmin,
    },
  );

  const isLoading = isSuperAdminLoading || isAdminLoading;

  const stats = isSuperAdmin
    ? getSuperAdminStats(superAdminStatsData)
    : isAdmin
      ? getAdminStats(adminStatsData)
      : [];

  console.log("Stats Data being passed:", superAdminStatsData || adminStatsData);
  console.log("Processed stats:", stats);

  return (
    <Box px={4} py={3}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        {isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard"}
      </Typography>
      <Typography color="text.secondary" mb={4}>
        {isSuperAdmin
          ? "Platform-wide insights across all cafes"
          : "Your cafe performance overview"}
      </Typography>

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
  );
}
