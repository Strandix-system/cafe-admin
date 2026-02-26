import Chart from "react-apexcharts";
import { Box } from "@mui/material";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";

export default function TablePerformanceChart() {
  const { data } = useFetch(
    ["dashboard-tables"],
    API_ROUTES.dashboardTables
  );

  const tableData = data?.result ?? [];

  const options = {
    chart: { type: "bar" },
    xaxis: {
      categories: tableData.map(item => `Table ${item._id}`),
    },
  };

  const series = [
    {
      name: "Income",
      data: tableData.map(item => item.income),
    },
  ];

  return (
    <Box mt={6}>
      <Chart options={options} series={series} type="bar" height={420} />
    </Box>
  );
}