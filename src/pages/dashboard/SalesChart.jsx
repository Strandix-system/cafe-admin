import Chart from "react-apexcharts";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";

export default function SalesChart({ range, salesDataOverride }) {
  const { user } = useAuth();

  const shouldFetch = !Array.isArray(salesDataOverride);

  const { data } = useFetch(
    ["dashboard-sales", user?._id, range],
    API_ROUTES.dashboardSales,
    {
      ...(range?.startDate && { startDate: range.startDate }),
      ...(range?.endDate && { endDate: range.endDate }),
    },
    { enabled: shouldFetch && !!user?._id }
  );

  const salesData = Array.isArray(salesDataOverride)
    ? salesDataOverride
    : data?.result ?? [];

  const formatLabel = (label) => {
    if (/^\d{1,2}-\d{4}$/.test(label)) {
      return dayjs(`01-${label}`, "DD-M-YYYY").format("MMM YYYY");
    }

    return dayjs(label).format("DD MMM");
  };

  const options = {
    chart: { type: "area", toolbar: { show: false }, width: "100%" },
    colors: ["#6F4E37"],
    xaxis: {
      categories: salesData.map((item) => formatLabel(item.label)),
      title: {
        text: salesData.length === 1 ? "Month" : "Date",
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`,
      },
    },
    tooltip: {
      x: {
        formatter: (_, { dataPointIndex }) => salesData[dataPointIndex]?.label,
      },
      y: {
        formatter: (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#6F4E37"],
    },
    markers: {
      size: 4,
      colors: ["#6F4E37"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
  };

  const series = [
    {
      name: "Sales Overview",
      data: salesData.map((item) => item.total),
    },
  ];

  return (
    <div className="w-full">
      <Chart options={options} series={series} height={380} width="100%" />
    </div>
  );
}