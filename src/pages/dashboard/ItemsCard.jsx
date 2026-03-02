import { Box, Card, Typography, Stack, CardMedia, Chip } from "@mui/material";
import { useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import { useAuth } from "../../context/AuthContext";

const ItemCard = ({ name, qty, image, revenue, type }) => {
  const isTop = type === "top";

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        transition: "all 0.25s ease",
        display: "flex",
        flexDirection: { xs: "row", md: "column" },
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 14px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardMedia
        component="img"
        image={image || "/placeholder-food.png"}
        alt={name}
        sx={{
          width: { xs: 96, md: "100%" },
          height: { xs: 96, md: 110 },
          objectFit: "cover",
          flexShrink: 0,
        }}
      />

      <Box
        p={1.2}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography fontWeight={600} fontSize={15} noWrap title={name}>
          {name}
        </Typography>

        <div className="flex gap-4">
          <Typography color="text.secondary" fontSize={13} mt={0.3}>
            Qty Sold: <strong>{qty}</strong>
          </Typography>
          <Typography color="text.secondary" fontSize={13} mt={0.3}>
            Revenue: <strong>{revenue}</strong>
          </Typography>
        </div>

        <Chip
          label={isTop ? "Top Seller" : "Low Seller"}
          size="small"
          sx={{
            mt: 0.6,
            width: "fit-content",
            bgcolor: isTop ? "#E8F5E9" : "#FDECEA",
            color: isTop ? "#2E7D32" : "#C62828",
            fontWeight: 500,
            height: 20,
          }}
        />
      </Box>
    </Card>
  );
};

export default function ItemCards({ itemsDataOverride }) {
  const { user } = useAuth();
  const shouldFetch = !itemsDataOverride;

  const { data } = useFetch(
    ["dashboard-items", user?._id],
    API_ROUTES.dashboardItems,
    {},
    { enabled: shouldFetch && !!user?._id }
  );

  const source = itemsDataOverride || data?.result || {};

  const top = source?.topSelling ?? null;
  const low = source?.lowSelling ?? null;

  if (!top && !low) {
    return null;
  }

  return (
    <Box>
      <Stack spacing={2}>
        <Box>
          <Box
            sx={{
              p: 1,
              borderRadius: 3,
              backgroundColor: "background.paper",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            <Typography fontWeight={600} fontSize={18} mb={1}>
              Top Selling Item
            </Typography>

            {top ? (
              <ItemCard
                name={top.name}
                qty={top.quantity}
                image={top.image}
                revenue={top.revenue}
                type="top"
              />
            ) : (
              <Typography fontSize={13} color="text.secondary">
                No data
              </Typography>
            )}
          </Box>
        </Box>

        <Box>
          <Box
            sx={{
              p: 1,
              borderRadius: 3,
              backgroundColor: "background.paper",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            <Typography fontWeight={600} fontSize={18} mb={1}>
              Low Selling Item
            </Typography>
            {low ? (
              <ItemCard
                name={low.name}
                qty={low.quantity}
                image={low.image}
                revenue={low.revenue}
                type="low"
              />
            ) : (
              <Typography fontSize={13} color="text.secondary">
                No data
              </Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}