// import { useAuth } from "../../context/AuthContext";
// import SuperAdminDashboard from "./SuperAdminDashboard";
// import AdminDashboard from "./AdminDashboard";

// export default function Dashboard() {
//     const {role} = useAuth();
//   const userRole = role?.toLowerCase(); // ✅ ADD
//   const isSuperAdmin = userRole === "superadmin";
//   const isAdmin = userRole === "admin";

//   if (isSuperAdmin) {
//     return <SuperAdminDashboard />;
//   }

//   if (isAdmin) {
//     return <AdminDashboard />;
//   }

//   return <div>Unauthorized</div>;

// };
// ------------------------------------------------------------------------------------------------------------------

// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   CardHeader,
//   Typography,
//   Button,
//   Stack,
//   Divider,
// } from "@mui/material";
// import { Edit, Trash } from "lucide-react";


// export default function Dashboard() {
//   const role = localStorage.getItem("role");
//   const isSuperAdmin = role === "superadmin";
//   const isAdmin = role === "admin";

//   function StatCard({ label, value }) {
//   return (
//     <Card
//       sx={{
//         height: "100%",
//         borderRadius: 3,
//         boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//       }}
//     >
//       <CardContent>
//         <Typography variant="subtitle2" color="text.secondary">
//           {label}
//         </Typography>
//         <Typography variant="h5" fontWeight={600} mt={1}>
//           {value}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// }


//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         p: 3,
//         background: "linear-gradient(to bottom right, #f8fafc, #eef2ff)",
//       }}
//     >
//       <Box maxWidth="1200px" mx="auto" display="flex" flexDirection="column" gap={3}>

//         {/* HEADER */}
//         <Typography variant="h4" fontWeight={700}>
//           {isSuperAdmin ? "Super Admin Dashboard" : "Cafe Admin Dashboard"}
//         </Typography>

//         {/* STATS */}
//         <StatsGrid
//           role={role}
//           stats={isAdmin ? stats : adminAnalytics}
//           isLoading={adminsLoading || ordersLoading}
//         />

//         {/* ================= SUPER ADMIN ================= */}
//         {isSuperAdmin && (
//           <Box display="grid" gridTemplateColumns={{ md: "1fr 1fr" }} gap={3}>

//             {/* ADMINS LIST */}
//             <Card>
//               <CardHeader title="Cafe Owners" />
//               <CardContent>
//                 <Stack spacing={2}>
//                   {admins.map((admin) => (
//                     <Box
//                       key={admin.id}
//                       display="flex"
//                       justifyContent="space-between"
//                       alignItems="center"
//                       border="1px solid #e5e7eb"
//                       borderRadius={2}
//                       p={2}
//                     >
//                       <Box>
//                         <Typography fontWeight={600}>
//                           {admin.name}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           Orders: {admin.totalOrders} | ₹{admin.totalEarnings}
//                         </Typography>
//                       </Box>

//                       <Stack direction="row" spacing={1}>
//                         <Button
//                           size="small"
//                           variant="outlined"
//                           onClick={() => setSelectedAdminId(admin.id)}
//                         >
//                           View
//                         </Button>
//                         <Button size="small" variant="outlined">
//                           <Edit size={16} />
//                         </Button>
//                         <Button
//                           size="small"
//                           color="error"
//                           variant="contained"
//                           onClick={() => deleteAdmin.mutate(admin.id)}
//                         >
//                           <Trash size={16} />
//                         </Button>
//                       </Stack>
//                     </Box>
//                   ))}
//                 </Stack>
//               </CardContent>
//             </Card>

//             {/* SELECTED ADMIN DETAILS */}
//             {adminAnalytics && (
//               <Card>
//                 <CardHeader
//                   title={`${adminAnalytics.cafeName} Analytics`}
//                 />
//                 <CardContent>
//                   <Stack spacing={1}>
//                     <Typography>
//                       Total Orders: {adminAnalytics.totalOrders}
//                     </Typography>
//                     <Typography>
//                       Total Earnings: ₹{adminAnalytics.totalEarnings}
//                     </Typography>
//                     <Typography>
//                       Most Ordered Item: {adminAnalytics.mostOrderedItem}
//                     </Typography>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             )}
//           </Box>
//         )}

//         {/* ================= ADMIN ================= */}
//         {isAdmin && (
//           <Box display="grid" gridTemplateColumns={{ md: "1fr 1fr" }} gap={3}>

//             <RecentActivity
//               title="Orders"
//               data={orders}
//               isLoading={ordersLoading}
//             />

//             <Card>
//               <CardHeader title="My Cafe Settings" />
//               <CardContent>
//                 <Stack spacing={3}>

//                   {/* MENU */}
//                   <Box>
//                     <Typography fontWeight={600}>Menu</Typography>
//                     <Divider sx={{ my: 1 }} />
//                     <Stack component="ul" spacing={0.5} sx={{ pl: 2 }}>
//                       {menu.map((item) => (
//                         <li key={item.id}>
//                           <Typography variant="body2">
//                             {item.name}
//                           </Typography>
//                         </li>
//                       ))}
//                     </Stack>
//                   </Box>

//                   {/* LAYOUTS */}
//                   <Box>
//                     <Typography fontWeight={600}>Layouts</Typography>
//                     <Divider sx={{ my: 1 }} />
//                     <Stack direction="row" spacing={1} flexWrap="wrap">
//                       {layouts.map((layout) => (
//                         <Button key={layout.id} variant="outlined">
//                           {layout.name}
//                         </Button>
//                       ))}
//                     </Stack>
//                   </Box>

//                 </Stack>
//               </CardContent>
//             </Card>
//           </Box>
//         )}

//       </Box>
//     </Box>
//   );
// }


// --------------------------------------------------------------------------------------------------------------


import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box, Stack, Button,  Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import BarChartIcon from "@mui/icons-material/BarChart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { useNavigate } from "react-router-dom";


  const colors = {
    brown: "#6F4E37",
    darkBrown: "#4B2E2B",
    cream: "#F5EFE6",
    lightCream: "#FAF7F2",
  };
export default function Dashboard() {

  const navigate = useNavigate();  
  const {role, logout} = useAuth();
  const userRole = role?.toLowerCase(); // ✅ ADD
  const isSuperAdmin = userRole === "superadmin";
  const isAdmin = userRole === "admin";

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
 

  const calculateStats = () => {
    if (isSuperAdmin) {
      return [
        { label: "Total Cafes", value: statsData?.totalCafes },
        { label: "Active Cafes", value: statsData?.activeCafes },
        { label: "Inactive Cafes", value: statsData?.inactiveCafes },
        // { label: "Total Orders", value: statsData?.totalOrders },
        // {
        //   label: "Total Earnings",
        //   value: `₹${statsData?.totalEarnings?.toLocaleString()}`,
        // },
      ];
    }

    if (isAdmin) {
      // ⏳ Admin stats will be calculated later
      return [];
    }

    return [];
  };

  const stats = calculateStats();

  return (
    <Box
      display = "flex"
      bgcolor = "#FAF7F2"
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
              <SidebarItem
                icon={<BarChartIcon />}
                label="Statistics"
                active={activeTab === "stats"}
                onClick={() => setActiveTab("stats")}
              />

              <SidebarItem
                icon={<AdminPanelSettingsIcon />}
                label="Admin Management"
                active={activeTab === "admins"}
                onClick={() => {
                  console.log("CLICKED ADMIN TAB");
                  console.log(role);
                  setActiveTab("admins");}}
              />
            </Stack>
          </Box>

          <Button
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": { bgcolor: "#4B2E2B" },
            }}
            variant="outlined"
          >
            Logout
          </Button>
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

        {isAdmin && (
            <Button
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                bgcolor: "#6F4E37",
                "&:hover": "#4B2E2B" 
              }}
            >
              Logout
            </Button>
          )}


        {/* STATS */}
        {isSuperAdmin && (
          <Grid container spacing={3}>
            {stats.map((stat) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={stat.label}>
                <StatCard
                  label={stat.label}
                  value={stat.value}
                  loading={isLoading}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {isSuperAdmin && activeTab === "admins" && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600}>
                Admin Management
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography color="text.secondary">
                Admin list table will be rendered here.
              </Typography>
            </CardContent>
          </Card>
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

/* ---------- STAT CARD ---------- */

function StatCard({ label, value, loading }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        bgcolor: "#F5EFE6",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        transition: "transform 0.2s ease",
        "&:hover": { transform: "translateY(-4px)" },
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          gutterBottom
        >
          {label}
        </Typography>

        <Typography variant="h5" fontWeight={700}  color="#6F4E37">
          {loading ? "—" : value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <Box
      onClick={onClick}
      display="flex"
      alignItems="center"
      gap={2}
      px={2}
      py={1.5}
      borderRadius={2}
      sx={{
        cursor: "pointer",
        bgcolor: active ? "rgba(255,255,255,0.15)" : "transparent",
        "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
      }}
    >
      {icon}
      <Typography fontWeight={500}>{label}</Typography>
    </Box>
  );
}
