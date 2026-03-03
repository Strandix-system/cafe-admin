export const getSuperAdminStats = (statsData) => [
  { label: "Total Cafes", value: statsData?.totalCafe ?? 0 ,path: "/cafes" },
  { label: "Active Cafes", value: statsData?.totalActive ?? 0 ,path: "/cafes?tab=active" },
  { label: "Inactive Cafes", value: statsData?.totalInActive ?? 0, path: "/cafes?tab=inactive" },
  {
    label: "Total Income",
    value: `₹${statsData?.totalIncome?.toLocaleString() ?? 0}`
  },
  {
    label: "Demo Requests",
    value: statsData?.totalDemoRequest ?? 0
  },
];

export const getAdminStats = (statsData) => [
  { label: "Total Customers", value: statsData?.totalCustomer ?? 0 ,path: "/customer" },
  { label: "Total Orders", value: statsData?.totalOrder ?? 0, path: "/order-management?tab=2" },
  {
    label: "Total Income",
    value: `₹${statsData?.totalIncome?.toLocaleString() ?? 0}`
  },
  { label: "Today's Customers", value: statsData?.todayCustomer ?? 0 },
  { label: "Today's Orders", value: statsData?.todayOrder ?? 0 },
  {
    label: "Today's Income",
    value: `₹${statsData?.todayIncome?.toLocaleString() ?? 0}`
  },
];