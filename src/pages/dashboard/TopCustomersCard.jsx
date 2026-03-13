import { Avatar, Chip, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../../context/AuthContext";
import { formatAmount } from "../../utils/utils";
import { InputField } from "../../components/common/InputField";
import { Crown } from "lucide-react";

const THEME_COLOR = "#6F4E37";

export function TopCustomersCard({
  overrideData,
  isViewingAdmin,
  filter,
  setFilter,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading, isFetching } = useFetch(
    ["top-customers", user?._id, filter],
    API_ROUTES.dashboardTopCustomers,
    { sortBy: filter },
    {
      enabled: !!user?._id && !isViewingAdmin,
      placeholderData: (previousData) => previousData,
    },
  );

  const customers = overrideData ?? data?.result ?? [];

  if (!isLoading && customers.length === 0) return null;

  const filterOptions = [
    { _id: "order", name: "By Orders" },
    { _id: "amount", name: "By Amount" },
  ];

  const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

  return (
    <div className="rounded-xl p-4 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.06)] bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <PersonIcon sx={{ color: THEME_COLOR, fontSize: 22 }} />
          <span className="text-[18px] font-semibold">Top Customers</span>
        </div>

        <div className="w-[180px]">
          <InputField
            isSelect
            options={filterOptions}
            field={{ value: filter }}
            onChange={(e) => setFilter(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#fff",
                height: 32,
                fontSize: "14px",
              },
            }}
          />
        </div>
      </div>

      {/* LIST */}
      <div className="relative grid auto-rows-[minmax(42px,auto)] flex-1 min-h-[220px]">
        {customers.map((customer, index) => (
          <div
            key={customer.customerId}
            onClick={
              isViewingAdmin
                ? undefined
                : () => navigate(`/my-orders/${customer.customerId}`)
            }
            className={`grid grid-cols-[32px_1fr_auto] items-center gap-2 px-2 py-2 rounded transition-all
            ${
              isViewingAdmin
                ? "cursor-default"
                : "cursor-pointer hover:bg-[#6F4E3710] hover:translate-x-[3px]"
            }`}
          >
            {/* RANK */}
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: 12,
                fontWeight: 700,
                bgcolor: rankColors[index] || THEME_COLOR,
                color: index < 3 ? "#000" : "#fff",
              }}
            >
              {index + 1}
            </Avatar>

            {/* CUSTOMER INFO */}
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[13.5px] font-semibold truncate">
                  {customer.name}
                </span>

                {customer.customerStatus === "frequent" && (
                  <Chip
                    label="Frequent"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "9px",
                      fontWeight: 600,
                      bgcolor: "#1B5E20",
                      color: "#fff",
                      borderRadius: "10px",
                      "& .MuiChip-label": { px: 0.6 },
                    }}
                  />
                )}

                {customer.customerStatus === "new" && (
                  <Chip
                    label="New"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "9px",
                      bgcolor: "#E5E7EB",
                      color: "#374151",
                      borderRadius: "10px",
                      "& .MuiChip-label": { px: 0.6 },
                    }}
                  />
                )}

                {customer.customerStatus === "vip" && (
                  <Chip
                    label="VIP"
                    icon={<Crown size={12} />}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "9px",
                      fontWeight: 700,
                      bgcolor: "#F59E0B",
                      color: "#000",
                      borderRadius: "10px",
                      "& .MuiChip-label": { px: 0.6 },
                    }}
                  />
                )}
              </div>

              <p className="text-[11px] text-gray-500">
                Total Orders: {customer.totalOrders}
              </p>
            </div>

            {/* AMOUNT */}
            <span className="text-[13px] font-bold text-gray-900">
              ₹{formatAmount(customer.totalAmount)}
            </span>
          </div>
        ))}

        {/* LOADER OVERLAY */}
        {isFetching && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-xl">
            <CircularProgress size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
