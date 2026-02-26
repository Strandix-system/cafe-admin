// ✅ Super Admin Dashboard Stats
export const getSuperAdminStats = (statsData) => [
  { label: "Total Cafes", value: statsData?.totalCafe ?? 0 },
  { label: "Active Cafes", value: statsData?.totalActive ?? 0 },
  { label: "Inactive Cafes", value: statsData?.totalInActive ?? 0 },
  {
    label: "Total Income",
    value: `₹${statsData?.totalIncome?.toLocaleString() ?? 0}`
  },
  {
    label: "Total Demo Requests",
    value: statsData?.totalDemoRequest ?? 0
  },
];

// ✅ Admin Dashboard Stats
export const getAdminStats = (statsData) => [
  { label: "Total Customers", value: statsData?.totalCustomer ?? 0 },
  { label: "Total Orders", value: statsData?.totalOrder ?? 0 },
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