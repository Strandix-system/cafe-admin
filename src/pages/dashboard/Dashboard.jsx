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
import TopCafesCard from "./TopCafesCard";
import PlatformSalesChart from "./PlatformSalesChart";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../../context/OrderContext";
import { OrderCard } from "../../components/OrderComponent/OrderCard";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

export function Dashboard() {
    const location = useLocation();
    const cafeNameFromState = location.state?.cafeName || "";

    const [adminRange, setAdminRange] = useState({
        startDate: null,
        endDate: null,
    });

    const { pendingOrders, acceptOrder } = useOrders();
    const navigate = useNavigate();
    const { isSuperAdmin, isAdmin, user } = useAuth();

    const { adminId } = useParams();

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
        ["dashboard-stats", user?._id, isSuperAdmin ? "super" : "admin"],
        API_ROUTES.dashboardStats,
        {},
        { enabled: roleReady && !!user?._id }
    );

    const { data: adminAnalyticsData, isLoading: adminAnalyticsLoading } =
        useFetch(
            ["admin-analytics", adminId, adminRange],
            API_ROUTES.dashboardAdminAnalytics,   // point this to api/admin/dashboard/admin-analytics
            {
                adminId,
                ...(adminRange.startDate && { startDate: adminRange.startDate }),
                ...(adminRange.endDate && { endDate: adminRange.endDate }),
            },
            { enabled: isSuperAdmin && !!adminId }
        );

    const isViewingAdmin = isSuperAdmin && !!adminId;

    const analyticsResult = adminAnalyticsData?.result ?? null;
    const cafeName = cafeNameFromState || "";

    // const statsData = data?.result ?? {};

    // const stats = isSuperAdmin
    //     ? getSuperAdminStats(statsData)
    //     : getAdminStats(statsData);
    const statsData = isViewingAdmin
        ? analyticsResult?.stats
        : data?.result ?? {};

    const stats = isSuperAdmin && !isViewingAdmin
        ? getSuperAdminStats(statsData)
        : getAdminStats(statsData);

    return (
        <Box sx={{
            px: { xs: 2, md: 4 },
            py: { xs: 2, md: 3 },
            maxWidth: "100%",
        }}>

            {isViewingAdmin && (
                <Box mt={1} mb={3}>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        color="#6F4E37"
                        mb={2}
                    >
                        {cafeName} Analytics
                    </Typography>
                </Box>
            )}

            <Grid container spacing={3}>

                <Grid size={{
                    xs: 12,
                    sm: 12,
                    md: pendingOrders.length > 0 ? 6 : 12,
                    // md: 2
                }} >
                    <Grid container spacing={2} >
                        {stats?.map((stat) => (
                            <Grid size={{
                                xs: 12,
                                sm: 6,
                                md: isAdmin && pendingOrders.length > 0 ? 6 : 2,
                                // md: 2
                            }} key={stat.label}>

                                <StatCard
                                    label={stat.label}
                                    value={stat.value}
                                    loading={isLoading}
                                    path={stat.path}
                                    disableClick={isViewingAdmin}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {isAdmin && pendingOrders.length > 0 && (
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                bgcolor: "#ffffff",
                                borderRadius: 3,
                                p: 2,
                                height: 450,
                                // height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                mb={2}
                                color="#6F4E37"
                            >
                                Pending Orders
                            </Typography>

                            <Box
                                sx={{
                                    flex: 1,
                                    overflowY: "scroll",
                                    pr: 1,
                                }}
                            >
                                <Grid container spacing={2}>
                                    {pendingOrders.map((order) => (
                                        <Grid item size={{ xs: 12 , sm:6 ,md:6 }} key={order._id}>
                                            <OrderCard
                                                order={order}
                                                isPending
                                                onAccept={acceptOrder}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                )}
            </Grid>


            {isViewingAdmin && (
                <Box mb={3} mt={4} display="flex" justifyContent="flex-end">
                    <DateRangeFilter onChange={setAdminRange} />
                </Box>
            )}
            {
                (isAdmin || isViewingAdmin) &&
                <>
                    <Grid container spacing={3} mt={5}>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <ChartCard
                                title="Sales Overview"
                                action={
                                    !isViewingAdmin && (
                                        <DateRangeFilter onChange={setSalesRange} />
                                    )
                                }
                            >
                                <SalesChart
                                    range={salesRange}
                                    overrideData={isViewingAdmin ? analyticsResult?.sales : null}
                                    isViewingAdmin={isViewingAdmin}
                                />
                            </ChartCard>
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6 }}>
                            <ChartCard
                                title="Peak Time"
                                action={
                                    !isViewingAdmin && (
                                        <DateRangeFilter onChange={setPeakRange} />
                                    )
                                }
                            >
                                <PeakTimeChart
                                    range={peakRange}
                                    overrideData={isViewingAdmin ? analyticsResult?.peakTime : null}
                                    isViewingAdmin={isViewingAdmin}
                                />
                            </ChartCard>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} mt={4} alignItems="stretch">
                        <Grid item size={{ xs: 12, md: 4 }}>
                            <ItemsCard overrideData={isViewingAdmin ? analyticsResult?.items : null} isViewingAdmin={isViewingAdmin} />
                        </Grid>

                        <Grid item size={{ xs: 12, md: 8 }}>
                            <TopCustomersCard
                                overrideData={isViewingAdmin ? analyticsResult?.topCustomers : null}
                                isViewingAdmin={isViewingAdmin}
                            />
                        </Grid>

                    </Grid>

                </>
            }


            {isSuperAdmin && !isViewingAdmin && (
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