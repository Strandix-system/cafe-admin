import { Card, Box, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import StoreIcon from "@mui/icons-material/Store";

const THEME_COLOR = "#6F4E37";

export default function TopCafesCard() {
  const navigate = useNavigate();

  const { data } = useFetch(
    ["top-cafes"],
    API_ROUTES.dashboardTopCafes
  );

  const cafes = data?.result ?? [];

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
      {/* HEADER */}
      <Box display="flex" alignItems="center" gap={1} mb={1.5}>
        <StoreIcon sx={{ color: THEME_COLOR, fontSize: 22 }} />
        <Typography fontSize={18} fontWeight={600}>
          Top Cafes
        </Typography>
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
            onClick={() => navigate(`/cafes/${cafe.cafeId}`)}
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
              <Typography fontSize={13.5} fontWeight={600} noWrap>
                {cafe.cafeName}
              </Typography>
              <Typography fontSize={11} color="text.secondary">
                Orders: {cafe.totalOrders}
              </Typography>
            </Box>

            <Typography fontSize={13} fontWeight={600}>
              ₹{cafe.totalAmount}
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