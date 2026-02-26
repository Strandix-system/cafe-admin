import { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { getSuperAdminStats, getAdminStats } from "../../configs/statsItems";
import StatCard from "./StatCard";
import SalesChart from "./SalesChart";
import PeakTimeChart from "./PeakTimeChart";
import ItemsCard from "./ItemsCard";
import ChartCard from "./ChartCard";
import DateRangeFilter from "./DateRangeFilter"
import TopCustomersCard from "./TopCustomersCard";
// import { useOrdersRealtime } from "../../utils/hooks/useOrdersRealtime";
import TopCafesCard from "./TopCafesCard";
import PlatformSalesChart from "./PlatformSalesChart";
// import { usePatch } from "../../utils/hooks/api_hooks";

export function Dashboard() {
    // useEffect(() => {
    //     const enableAudio = () => {
    //         const audio = new Audio();
    //         audio.play().catch(() => { });
    //         window.removeEventListener("click", enableAudio);
    //     };

    //     window.addEventListener("click", enableAudio);
    //     return () => window.removeEventListener("click", enableAudio);
    // }, []);

    const { isSuperAdmin, isAdmin, user } = useAuth();

    const [salesRange, setSalesRange] = useState({
        startDate: null,
        endDate: null,
    });

    const [peakRange, setPeakRange] = useState({
        startDate: null,
        endDate: null,
    });

    const [platformSalesRange, setPlatformSalesRange] = useState({
        startDate: null,
        endDate: null,
    });

    const roleReady = isSuperAdmin || isAdmin;

    const { data, isLoading } = useFetch(
        ["dashboard-stats", isSuperAdmin ? "super" : "admin"],
        API_ROUTES.dashboardStats,
        {},
        {
            enabled: roleReady, // 🔥 THIS IS THE FIX
        }
    );

    // const { data: ordersData } = useFetch(
    //     ["get-all-orders"],
    //     API_ROUTES.getAllOrders,
    //     {
    //         onSuccess: () => {
    //             queryClient.invalidateQueries({ queryKey: "get-all-orders" });
    //         }
    //     },
    //     {
    //         enabled: isAdmin,
    //         staleTime: Infinity,
    //     },
    // );

    // const pendingOrders =
    //     ordersData?.result?.results?.filter(
    //         (o) => o.orderStatus === "pending"
    //     ) ?? [];

    // const { mutate } = usePatch(API_ROUTES.updateOrder, {
    //     onSuccess: () => {
    //         toast.success("Order updated!");
    //         queryClient.invalidateQueries({ queryKey: "get-all-orders" });
    //     },
    // });

    // const acceptOrder = (orderId) => {
    //     mutate({
    //         orderId,
    //         orderStatus: "accepted",
    //     });
    // };

    const statsData = data?.result ?? {};

    const stats = isSuperAdmin
        ? getSuperAdminStats(statsData)
        : getAdminStats(statsData);

    return (
        <Box sx={{
            px: { xs: 2, md: 4 },
            py: { xs: 2, md: 3 },
            maxWidth: "100%",
        }}>
            {/* <Typography
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
            </Typography> */}

            <Grid container spacing={4} >
                {stats?.map((stat) => (
                    <Grid size={{
                        xs: 12,
                        sm: 6,
                        // md: pendingOrders.length > 0 ? 2 : 2.4
                        md:2.4
                    }} key={stat.label}>
                        <StatCard
                            label={stat.label}
                            value={stat.value}
                            loading={isLoading}
                        />
                    </Grid>
                ))}

                {/* {isAdmin && pendingOrders.length > 0 && (
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Box mb={4}>
                            <Typography variant="h6" fontWeight={700} mb={2} color="#6F4E37">
                                Pending Orders
                            </Typography>

                            <Grid container spacing={3}>
                                {pendingOrders.slice(0, 3).map((order) => (
                                    <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={order._id}>
                                        <OrderCard
                                            order={order}
                                            isPending
                                            onAccept={acceptOrder}
                                            onComplete={() => { }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>
                )} */}
            </Grid>

            {
                isAdmin &&
                <>
                    <Grid container spacing={3} mt={4}>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <ChartCard
                                title="Sales Overview"
                                action={<DateRangeFilter onChange={setSalesRange} />}
                            >
                                <SalesChart range={salesRange} />
                            </ChartCard>
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6 }}>
                            <ChartCard
                                title="Peak Time"
                                action={<DateRangeFilter onChange={setPeakRange} />}
                            >
                                <PeakTimeChart range={peakRange} />
                            </ChartCard>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} mt={4}>
                        <Grid item size={{ xs: 12, md: 2 }}>
                            <ItemsCard />
                        </Grid>

                        <Grid item size={{ xs: 12, md: 4 }}>
                            <TopCustomersCard />
                        </Grid>

                    </Grid>

                </>
            }


            {isSuperAdmin && (
                <Grid container spacing={3} mt={6}>


                    <Grid item size={{ xs: 12, md: 8 }}>
                        <ChartCard
                            title="Platform Sales Overview"
                            action={<DateRangeFilter onChange={setPlatformSalesRange} />}
                        >
                            <PlatformSalesChart range={platformSalesRange} />
                        </ChartCard>
                    </Grid>

                    <Grid item size={{ xs: 12, md: 4 }}>
                        <TopCafesCard />
                    </Grid>
                </Grid>
            )}

        </Box >
    );
}