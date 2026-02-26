import Chart from "react-apexcharts";
import { Box } from "@mui/material";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";

export default function PeakTimeChart({range}) {
  const { data } = useFetch(
    ["dashboard-peak-time", range],
    API_ROUTES.dashboardPeakTime,
    {
      ...(range.startDate && { startDate: range.startDate }),
      ...(range.endDate && { endDate: range.endDate }),
    }
  );

  const peakData = data?.result ?? [];

  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
      width: "100%",
    },
    colors: ["#6F4E37"],
    xaxis: {
      categories: peakData.map((item) => item.hour),
      title: { text: "Hour" },
    },
    yaxis: {
      title: { text: "Orders" },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth", width: 3,
      colors: ["#6F4E37"],
    },

    markers: {
      size: 4,
      colors: ["#6F4E37"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} orders`,
      },
    },
  };

  const series = [
    {
      name: "Orders",
      data: peakData.map((item) => item.orders),
    },
  ];

  return (
    <Box width="100%" height="100%">
      <Chart
        options={options}
        series={series}
        type="area"
        height={360}
        width="100%"
      />
    </Box>
  );
}