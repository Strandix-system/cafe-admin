import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export function StatCard({ label, value, loading }) {
    return (
        <Card
            sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 4,
                background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
                transition: "all 0.25s ease",
                border: "1px solid rgba(0,0,0,0.05)",
                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                            color: "text.secondary",
                            letterSpacing: 0.5,
                        }}
                    >
                        {label}
                    </Typography>

                    <Box
                        sx={{
                            bgcolor: "rgba(111,78,55,0.08)",
                            borderRadius: "50%",
                            p: 1,
                            display: "flex",
                        }}
                    >
                        <TrendingUpIcon sx={{ fontSize: 18, color: "#6F4E37" }} />
                    </Box>
                </Box>

                {loading ? (
                    <Skeleton variant="text" width={80} height={40} />
                ) : (
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "#2E2E2E",
                        }}
                    >
                        {value}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
