export const getSuperAdminStats = (statsData) => [
  { label: "Total Cafes", value: statsData?.totalCafes },
  { label: "Active Cafes", value: statsData?.activeCafes },
  { label: "Inactive Cafes", value: statsData?.inactiveCafes },
  { label: "Total Orders", value: statsData?.totalOrders },
  { label: "Total Earnings", value: `₹${statsData?.totalEarnings?.toLocaleString()}` },
];

export const getAdminStats = (statsData) => [
  { label: "Today's Orders", value: statsData?.todayOrders },
  { label: "Total Earnings", value: `₹${statsData?.totalEarnings?.toLocaleString()}` },
  { label: "Most Ordered Item", value: statsData?.mostOrderedItem },
];
