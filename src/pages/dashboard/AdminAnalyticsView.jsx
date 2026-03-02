import { useMemo, useState } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { getAdminStats } from "../../configs/statsItems";
import StatCard from "./StatCard";
import SalesChart from "./SalesChart";
import PeakTimeChart from "./PeakTimeChart";
import ItemsCard from "./ItemsCard";
import TopCustomersCard from "./TopCustomersCard";
import ChartCard from "./ChartCard";
import DateRangeFilter from "./DateRangeFilter";

const THEME_COLOR = "#6F4E37";

export default function AdminAnalyticsView({ adminId }) {
  const navigate = useNavigate();

  const [range, setRange] = useState({
    startDate: null,
    endDate: null,
  });

  const params = useMemo(
    () => ({
      adminId,
      ...(range.startDate && { startDate: range.startDate }),
      ...(range.endDate && { endDate: range.endDate }),
    }),
    [adminId, range]
  );

  const { data, isLoading } = useFetch(
    ["admin-analytics", adminId, range.startDate, range.endDate],
    API_ROUTES.dashboardAdminAnalytics,
    params,
    { enabled: !!adminId }
  );

  const analytics = data?.result || {};
  const stats = getAdminStats(analytics.stats || {});

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 3 },
        maxWidth: "100%",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Cafe Analytics View
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/dashboard")}
          sx={{ borderColor: THEME_COLOR, color: THEME_COLOR, textTransform: "none" }}
        >
          Back to Super Admin Dashboard
        </Button>
      </Box>

      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 2,
            }}
            key={stat.label}
          >
            <StatCard label={stat.label} value={stat.value} loading={isLoading} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} mt={5}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <ChartCard
            title="Sales Overview"
            action={<DateRangeFilter onChange={setRange} />}
          >
            <SalesChart range={range} salesDataOverride={analytics.sales || []} />
          </ChartCard>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <ChartCard
            title="Peak Time"
            action={<DateRangeFilter onChange={setRange} />}
          >
            <PeakTimeChart range={range} peakDataOverride={analytics.peakTime || []} />
          </ChartCard>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={4}>
        <Grid item size={{ xs: 12, md: 2 }}>
          <ItemsCard itemsDataOverride={analytics.items || {}} />
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
          <TopCustomersCard customersDataOverride={analytics.topCustomers || []} />
        </Grid>
      </Grid>
    </Box>
  );
}