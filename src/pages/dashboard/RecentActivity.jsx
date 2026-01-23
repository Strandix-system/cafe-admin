import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Stack,
  Skeleton,
} from "@mui/material";
import { ShoppingCart, Clock } from "lucide-react";

/*
Expected data format:
[
  {
    id,
    title,        // e.g. "Latte x2"
    cafeName,     // optional (for superadmin)
    amount,
    status,
    createdAt
  }
]
*/

export default function RecentActivity({
  title = "Recent Orders",
  data = [],
  isLoading = false,
}) {
  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        }
      />

      <CardContent>
        {/* LOADING STATE */}
        {isLoading && (
          <Stack spacing={2}>
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={40}
                animation="wave"
              />
            ))}
          </Stack>
        )}

        {/* EMPTY STATE */}
        {!isLoading && data.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
          >
            No activity found
          </Typography>
        )}

        {/* DATA LIST */}
        {!isLoading && data.length > 0 && (
          <Stack spacing={2}>
            {data.map((item) => (
              <Box
                key={item.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom="1px solid #e5e7eb"
                pb={1}
              >
                {/* LEFT */}
                <Box display="flex" gap={1.5} alignItems="center">
                  <ShoppingCart size={18} color="#4f46e5" />
                  <Box>
                    <Typography fontWeight={500}>
                      {item.title}
                    </Typography>

                    {item.cafeName && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {item.cafeName}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* RIGHT */}
                <Box textAlign="right">
                  <Typography fontWeight={600}>
                    ₹{item.amount}
                  </Typography>

                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                    justifyContent="flex-end"
                  >
                    <Clock size={12} />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.createdAt).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
