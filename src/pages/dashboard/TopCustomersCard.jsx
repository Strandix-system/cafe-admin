import { Card, Box, Typography, Avatar, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../../context/AuthContext";
import { Chip, Stack } from "@mui/material";
import { formatAmount } from "../../utils/utils";
import { InputField } from "../../components/common/InputField";
import { useState } from "react";
import { Crown } from "lucide-react";

const THEME_COLOR = "#6F4E37";

export default function TopCustomersCard({
  overrideData,
  isViewingAdmin,
  filter,
  setFilter,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading } = useFetch(
    ["top-customers", user?._id, filter],
    API_ROUTES.dashboardTopCustomers,
    { sortBy: filter },
    { enabled: !!user?._id && !isViewingAdmin },
  );

  const customers = overrideData ?? data?.result ?? [];

  if (!customers?.length) return null;

  const filterOptions = [
    { _id: "order", name: "By Orders" },
    { _id: "amount", name: "By Amount" },
  ];

  const rankColors = [
    "#FFD700", // 🥇 Gold
    "#C0C0C0", // 🥈 Silver
    "#CD7F32", // 🥉 Bronze
  ];
  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1.5}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon sx={{ color: THEME_COLOR, fontSize: 22 }} />
          <Typography fontSize={18} fontWeight={600}>
            Top Customers
          </Typography>
        </Box>

        <Box sx={{ width: 180 }}>
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
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridAutoRows: "minmax(42px, auto)",
          flex: 1,
        }}
      >
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={3}
          >
            <CircularProgress size={22} />
          </Box>
        ) : customers.length === 0 ? (
          <Typography
            fontSize={13}
            color="text.secondary"
            textAlign="center"
            mt={2}
          >
            No customers found
          </Typography>
        ) : (
          customers.map((customer, index) => (
            <Box
              key={customer.customerId}
              onClick={
                isViewingAdmin
                  ? undefined
                  : () => navigate(`/my-orders/${customer.customerId}`)
              }
              sx={{
                cursor: isViewingAdmin ? "default" : "pointer",
                display: "grid",
                gridTemplateColumns: "32px 1fr auto",
                alignItems: "center",
                gap: 1.2,
                px: 1.2,
                py: 1,
                borderRadius: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: `${THEME_COLOR}12`,
                  transform: "translateX(3px)",
                },
              }}
            >
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

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography fontSize={13.5} fontWeight={600} noWrap>
                    {customer.name}
                  </Typography>

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
                </Box>

                <Typography fontSize={11} color="text.secondary">
                  Total Orders: {customer.totalOrders}
                </Typography>
              </Box>

              <Typography
                fontSize={13}
                fontWeight={700}
                sx={{ color: "#111827" }}
              >
                ₹{formatAmount(customer.totalAmount)}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Card>
  );
}
