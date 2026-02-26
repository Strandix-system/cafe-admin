import { useState } from "react";
import Chart from "react-apexcharts";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import DateRangeFilter from "./DateRangeFilter";
import dayjs from "dayjs";

export default function SalesChart({range}){
  // const [range, setRange] = useState({
  //   startDate: null,
  //   endDate: null,
  // });

  const { data } = useFetch(
    ["dashboard-sales", range],
    API_ROUTES.dashboardSales,
    {
      ...(range.startDate && { startDate: range.startDate }),
      ...(range.endDate && { endDate: range.endDate }),
    },
    // { enabled: !!range.startDate }
  );

  const salesData = data?.result ?? [];

  /* ---------------- LABEL FORMATTER ---------------- */

  const formatLabel = (label) => {
    // Monthly format: "2-2026"
    if (/^\d{1,2}-\d{4}$/.test(label)) {
      return dayjs(`01-${label}`, "DD-M-YYYY").format("MMM YYYY");
    }

    // Daily format: "2026-02-17"
    return dayjs(label).format("DD MMM");
  };


  const options = {
    chart: { type: "area", toolbar: { show: false }, width: "100%", },
    colors: ["#6F4E37"],
   
    xaxis: {
      categories: salesData.map((item) => formatLabel(item.label)),
      title: {
        text: salesData.length === 1 ? "Month" : "Date",
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `₹${value.toLocaleString("en-IN")}`,
      },
    },
    tooltip: {
      x: {
        formatter: (_, { dataPointIndex }) =>
          salesData[dataPointIndex]?.label,
      },
      y: {
        formatter: (value) => `₹${value.toLocaleString("en-IN")}`,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth", width: 3,
      colors: ["#6F4E37"]
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
      {/* <div className="flex flex-end mb-2">
        <DateRangeFilter onChange={setRange} />
      </div> */}

      <Chart options={options} series={series} height={380} width="100%" />
    </div>
  );
}
