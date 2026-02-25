import { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { getSuperAdminStats, getAdminStats } from "../../configs/statsItems";
import {StatCard} from "./StatCard";

export function Dashboard() {
    const { isSuperAdmin, isAdmin } = useAuth();

    const roleReady = isSuperAdmin || isAdmin;

    const { data, isLoading } = useFetch(
        ["dashboard-stats", isSuperAdmin ? "super" : "admin"],
        API_ROUTES.dashboardStats,
        {},
        {
            enabled: roleReady, // 🔥 THIS IS THE FIX
        }
    );
    const statsData = data?.data ?? [];
    const stats = isSuperAdmin
        ? getSuperAdminStats(statsData)
        : getAdminStats(statsData);

    return (
        <Box px={{ xs: 2, md: 5 }} py={{ xs: 3, md: 4 }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    background: "linear-gradient(90deg, #6F4E37, #A67B5B)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                {isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard"}
            </Typography>
            <Typography color="text.secondary" mb={4}>
                {isSuperAdmin
                    ? "Platform-wide insights across all cafes"
                    : "Your cafe performance overview"}
            </Typography>

            <Grid container spacing={4}>
                {stats?.map((stat) => (
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