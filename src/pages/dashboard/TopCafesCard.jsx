import { Avatar, Chip, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import StoreIcon from "@mui/icons-material/Store";
import { useAuth } from "../../context/AuthContext";
import { formatAmount } from "../../utils/utils";
import { useState } from "react";
import { InputField } from "../../components/common/InputField";
import StarIcon from "@mui/icons-material/Star";

const THEME_COLOR = "#6F4E37";

export function TopCafesCard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState("orders");

  const { data, isLoading, isFetching } = useFetch(
    ["top-cafes", user?._id, filter],
    API_ROUTES.dashboardTopCafes,
    { sortBy: filter },
    { enabled: !!user?._id, placeholderData: (previousData) => previousData },
  );

  const cafes = data?.result ?? [];

  if (!isLoading && cafes.length === 0) {
    return null;
  }

  const filterOptions = [
    { _id: "orders", name: "By Orders" },
    { _id: "amount", name: "By Income" },
    { _id: "rating", name: "By Ratings" },
  ];

  const getRankColor = (index) => {
    if (index === 0) return "#FFD700"; // Gold
    if (index === 1) return "#C0C0C0"; // Silver
    if (index === 2) return "#CD7F32"; // Bronze
    return THEME_COLOR; // default
  };

  return (
    <div className="rounded-xl p-4 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.06)] bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <StoreIcon sx={{ color: THEME_COLOR, fontSize: 22 }} />
          <span className="text-[18px] font-semibold">Top Cafes</span>
        </div>

        <div className="w-45">
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
      <div className="grid auto-rows-[minmax(42px,auto)] flex-1">
        {isFetching ? (
          <div className="flex justify-center items-center py-3">
            <CircularProgress size={22} />
          </div>
        ) : (
          cafes.map((cafe, index) => (
            <div
              key={cafe.cafeId}
              onClick={() =>
                navigate(`/dashboard/${cafe.cafeId}`, {
                  state: { cafeName: cafe.cafeName },
                })
              }
              className="grid grid-cols-[32px_1fr_auto] items-center gap-2 cursor-pointer px-2 py-1.5 rounded hover:bg-[#6F4E3710]"
            >
              {/* RANK */}
              <Avatar
                sx={{
                  width: 22,
                  height: 22,
                  fontSize: 11,
                  bgcolor: getRankColor(index),
                  color: index < 3 ? "#000" : "#fff",
                  fontWeight: 600,
                }}
              >
                {index + 1}
              </Avatar>

              {/* CAFE INFO */}
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[13.5px] font-semibold truncate">
                    {cafe.cafeName}
                  </span>

                  {Number(cafe.averageRating) > 0 && (
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
                </div>

                <p className="text-[11px] text-gray-500">
                  Orders: {cafe.totalOrders}
                </p>
              </div>

              {/* AMOUNT */}
              <span className="text-[13px] font-semibold">
                ₹{formatAmount(cafe.totalAmount)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
