import Chart from "react-apexcharts";
import { Box } from "@mui/material";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";

const THEME_COLOR = "#6F4E37";

export default function PlatformSalesChart({ range }) {
    const { data, isLoading } = useFetch(
  ["platform-sales", range],
  API_ROUTES.dashboardPlatformSales,
  {
    ...(range?.startDate && { startDate: range.startDate }),
    ...(range?.endDate && { endDate: range.endDate }),
  },
)

    const chartData = data?.result ?? [];

    const series = [
        {
            name: "Orders",
            type: "column",
            data: chartData.map((d) => d.orders),
        },
        {
            name: "Revenue",
            type: "line",
            data: chartData.map((d) => d.revenue),
        },
    ];

    const options = {
        chart: {
            toolbar: { show: false },
            fontFamily: "inherit",
        },
        stroke: {
            width: [0, 3],
            curve: "smooth",
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: "45%",
            },
        },
        colors: [THEME_COLOR, "#A67B5B"],
        xaxis: {
            categories: chartData.map((d) => d.label),
        },
        yaxis: [
            {
                title: { text: "Orders" },
            },
            {
                opposite: true,
                title: { text: "Revenue (₹)" },
            },
        ],
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (val, { seriesIndex }) => {
                    // seriesIndex: 0 = Orders, 1 = Revenue
                    if (seriesIndex === 0) {
                        return val; // Orders → number only
                    }
                    return `₹${val.toLocaleString("en-IN")}`; // Revenue → rupees
                },
            },
        },
        legend: {
            position: "top",
            horizontalAlign: "right",
        },
    };

    return (
        <Box>
            <Chart
                options={options}
                series={series}
                type="line"
                height={320}
            />
        </Box>
    );
}