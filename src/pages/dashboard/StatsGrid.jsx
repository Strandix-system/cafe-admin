import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import {
  Users,
  ShoppingCart,
  IndianRupee,
  Star,
  LayoutDashboard,
} from "lucide-react";

/*
Expected stats shapes:

SUPER ADMIN:
{
  totalAdmins,
  totalOrders,
  totalEarnings,
  topCafe
}

ADMIN:
{
  totalOrders,
  totalEarnings,
  mostOrderedItem,
  activeLayout
}
*/

export default function StatsGrid({ role, stats, isLoading = false }) {
  /* LOADING STATE */
  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {[...Array(4)].map((_, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Skeleton
              variant="rounded"
              height={110}
              animation="wave"
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!stats) return null;

  const cards =
    role === "superadmin"
      ? [
          {
            label: "Total Cafe Owners",
            value: stats.totalAdmins,
            icon: Users,
          },
          {
            label: "Total Orders",
            value: stats.totalOrders,
            icon: ShoppingCart,
          },
          {
            label: "Total Earnings",
            value: `₹${stats.totalEarnings}`,
            icon: IndianRupee,
          },
          {
            label: "Top Performing Cafe",
            value: stats.topCafe,
            icon: Star,
          },
        ]
      : [
          {
            label: "Total Orders",
            value: stats.totalOrders,
            icon: ShoppingCart,
          },
          {
            label: "Total Earnings",
            value: `₹${stats.totalEarnings}`,
            icon: IndianRupee,
          },
          {
            label: "Most Ordered Item",
            value: stats.mostOrderedItem,
            icon: Star,
          },
          {
            label: "Active Layout",
            value: stats.activeLayout,
            icon: LayoutDashboard,
          },
        ];

  return (
    <Grid container spacing={2}>
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent
                sx={{
                  p: 2.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {card.label}
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mt={0.5}
                  >
                    {card.value ?? "-"}
                  </Typography>
                </Box>

                <Icon size={32} color="#4f46e5" />
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
