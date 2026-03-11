import { Card, Box, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import StoreIcon from "@mui/icons-material/Store";
import { useAuth } from "../../context/AuthContext";
import { formatAmount } from "../../utils/utils";
import { useState } from "react";
import { InputField } from "../../components/common/InputField";
import { Chip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const THEME_COLOR = "#6F4E37";

export default function TopCafesCard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState("orders");

  const { data } = useFetch(
    ["top-cafes", user?._id, filter],
    API_ROUTES.dashboardTopCafes,
    { sortBy: filter },
    { enabled: !!user?._id },
  );

  const cafes = data?.result ?? [];
  if (cafes.length === 0) {
    return null;
  }

  const filterOptions = [
    { _id: "orders", name: "By Orders" },
    { _id: "amount", name: "By Income" },
    { _id: "rating", name: "By Ratings" },
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
          <StoreIcon sx={{ color: THEME_COLOR, fontSize: 22 }} />
          <Typography fontSize={18} fontWeight={600}>
            Top Cafes
          </Typography>
        </Box>

        <Box sx={{ width: 180 }}>
          <InputField
            isAutocomplete
            options={filterOptions}
            getOptionLabel={(option) => option.name}
            field={{ value: filter }}
            onOptionChange={(value) => setFilter(value?._id || "")}
            placeholder="Sort By"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#fff",
                height: 32, // ↓ reduce height
                fontSize: "15px",
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
        {cafes.map((cafe, index) => (
          <Box
            key={cafe.cafeId}
            onClick={() =>
              navigate(`/dashboard/${cafe.cafeId}`, {
                state: { cafeName: cafe.cafeName },
              })
            }
            sx={{
              display: "grid",
              gridTemplateColumns: "32px 1fr auto",
              alignItems: "center",
              gap: 1.2,
              cursor: "pointer",
              px: 1,
              py: 0.6,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: `${THEME_COLOR}10`,
              },
            }}
          >
            {/* RANK */}
            <Avatar
              sx={{
                width: 22,
                height: 22,
                fontSize: 11,
                bgcolor: THEME_COLOR,
              }}
            >
              {index + 1}
            </Avatar>

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <Typography fontSize={13.5} fontWeight={600} noWrap>
                  {cafe.cafeName}
                </Typography>

                {cafe.averageRating && (
                  <Chip
                    icon={<StarIcon sx={{ fontSize: 14 }} />}
                    label={cafe.averageRating}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "10px",
                      fontWeight: 600,
                      bgcolor: "#FEF3C7",
                      color: "#92400E",
                      borderRadius: "10px",
                      "& .MuiChip-label": { px: 0.6 },
                    }}
                  />
                )}
              </Box>

              <Typography fontSize={11} color="text.secondary">
                Orders: {cafe.totalOrders}
              </Typography>
            </Box>

            <Typography fontSize={13} fontWeight={600}>
              ₹{formatAmount(cafe.totalAmount)}
            </Typography>
          </Box>
        ))}

        {cafes.length === 0 && (
          <Typography
            fontSize={13}
            color="text.secondary"
            textAlign="center"
            mt={2}
          >
            No data available
          </Typography>
        )}
      </Box>
    </Card>
  );
}
