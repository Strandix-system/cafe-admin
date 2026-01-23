import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { Edit, Trash } from "lucide-react";

/* Dashboard blocks */
import StatsGrid from "./StatsGrid";
import RecentActivity from "./RecentActivity";

/* Queries */
import {
  useAdmins,
  useAdminAnalytics,
  useDeleteAdmin,
  useAdminStats,
  useOrders,
  useMenu,
  useLayouts,
} from "../../api/queries/dashboard.queries";

export default function Dashboard() {
  const role = localStorage.getItem("role");
  const isSuperAdmin = role === "superadmin";
  const isAdmin = role === "admin";

  const [selectedAdminId, setSelectedAdminId] = useState(null);

  /* ================= SUPER ADMIN ================= */
  const { data: admins = [], isLoading: adminsLoading } =
    useAdmins(isSuperAdmin);

  const { data: adminAnalytics } =
    useAdminAnalytics(selectedAdminId, isSuperAdmin);

  const deleteAdmin = useDeleteAdmin();

  /* ================= ADMIN ================= */
  const { data: stats } = useAdminStats(isAdmin);
  const { data: orders = [], isLoading: ordersLoading } = useOrders(isAdmin);
  const { data: menu = [] } = useMenu(isAdmin);
  const { data: layouts = [] } = useLayouts(isAdmin);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 3,
        background: "linear-gradient(to bottom right, #f8fafc, #eef2ff)",
      }}
    >
      <Box maxWidth="1200px" mx="auto" display="flex" flexDirection="column" gap={3}>

        {/* HEADER */}
        <Typography variant="h4" fontWeight={700}>
          {isSuperAdmin ? "Super Admin Dashboard" : "Cafe Admin Dashboard"}
        </Typography>

        {/* STATS */}
        <StatsGrid
          role={role}
          stats={isAdmin ? stats : adminAnalytics}
          isLoading={adminsLoading || ordersLoading}
        />

        {/* ================= SUPER ADMIN ================= */}
        {isSuperAdmin && (
          <Box display="grid" gridTemplateColumns={{ md: "1fr 1fr" }} gap={3}>

            {/* ADMINS LIST */}
            <Card>
              <CardHeader title="Cafe Owners" />
              <CardContent>
                <Stack spacing={2}>
                  {admins.map((admin) => (
                    <Box
                      key={admin.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      border="1px solid #e5e7eb"
                      borderRadius={2}
                      p={2}
                    >
                      <Box>
                        <Typography fontWeight={600}>
                          {admin.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Orders: {admin.totalOrders} | ₹{admin.totalEarnings}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setSelectedAdminId(admin.id)}
                        >
                          View
                        </Button>
                        <Button size="small" variant="outlined">
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={() => deleteAdmin.mutate(admin.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* SELECTED ADMIN DETAILS */}
            {adminAnalytics && (
              <Card>
                <CardHeader
                  title={`${adminAnalytics.cafeName} Analytics`}
                />
                <CardContent>
                  <Stack spacing={1}>
                    <Typography>
                      Total Orders: {adminAnalytics.totalOrders}
                    </Typography>
                    <Typography>
                      Total Earnings: ₹{adminAnalytics.totalEarnings}
                    </Typography>
                    <Typography>
                      Most Ordered Item: {adminAnalytics.mostOrderedItem}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {/* ================= ADMIN ================= */}
        {isAdmin && (
          <Box display="grid" gridTemplateColumns={{ md: "1fr 1fr" }} gap={3}>

            <RecentActivity
              title="Orders"
              data={orders}
              isLoading={ordersLoading}
            />

            <Card>
              <CardHeader title="My Cafe Settings" />
              <CardContent>
                <Stack spacing={3}>

                  {/* MENU */}
                  <Box>
                    <Typography fontWeight={600}>Menu</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Stack component="ul" spacing={0.5} sx={{ pl: 2 }}>
                      {menu.map((item) => (
                        <li key={item.id}>
                          <Typography variant="body2">
                            {item.name}
                          </Typography>
                        </li>
                      ))}
                    </Stack>
                  </Box>

                  {/* LAYOUTS */}
                  <Box>
                    <Typography fontWeight={600}>Layouts</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {layouts.map((layout) => (
                        <Button key={layout.id} variant="outlined">
                          {layout.name}
                        </Button>
                      ))}
                    </Stack>
                  </Box>

                </Stack>
              </CardContent>
            </Card>
          </Box>
        )}

      </Box>
    </Box>
  );
}
