import React, { memo } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Chip,
} from "@mui/material";
import {
    Restaurant,
    LocalDining,
    CheckCircle,
    TaskAlt,
    StickyNote2,
} from "@mui/icons-material";

const OrderCard = memo(({ order, isPending, onAccept, onComplete }) => {
    const handleAction = () => {
        if (isPending) {
            onAccept(order._id);
        } else {
            onComplete(order._id);
        }
    };

    return (
        <Card
            sx={{
                bgcolor: "#FFFFFF",
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(111, 78, 55, 0.1)",
                border: "2px solid #F5EFE6",
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(111, 78, 55, 0.15)",
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* Header with Table Number */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                        pb: 2,
                        borderBottom: "2px solid #F5EFE6",
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{
                            color: "#6F4E37",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Restaurant sx={{ fontSize: 28 }} />
                        Table {order.tableNumber}
                    </Typography>
                    <Chip
                        label={order.orderStatus.toUpperCase()}
                        size="small"
                        sx={{
                            bgcolor: isPending ? "#FFF3E0" : "#E8F5E9",
                            color: isPending ? "#F57C00" : "#2E7D32",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                        }}
                    />
                </Box>

                {/* Items List */}
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        color="#6F4E37"
                        sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                        <LocalDining sx={{ fontSize: 18 }} />
                        Items:
                    </Typography>
                    {order.items?.map((item, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                py: 0.5,
                                px: 1.5,
                                bgcolor: "#FAF7F2",
                                borderRadius: 1,
                                mb: 0.5,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                {item.quantity} x {item.name}
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="#6F4E37">
                                ₹{item.price}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Total Amount */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        bgcolor: "#F5EFE6",
                        p: 1.5,
                        borderRadius: 2,
                        mb: 2,
                    }}
                >
                    <Typography variant="body1" fontWeight={600} color="#6F4E37">
                        Total Amount:
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="#6F4E37">
                        ₹{order.totalAmount}
                    </Typography>
                </Box>

                {/* Special Instructions */}
                {order.specialInstruction && (
                    <Box
                        sx={{
                            bgcolor: "#FFF9C4",
                            p: 1.5,
                            borderRadius: 2,
                            mb: 2,
                            borderLeft: "4px solid #FBC02D",
                        }}
                    >
                        <Typography
                            variant="caption"
                            fontWeight={600}
                            color="#F57F17"
                            sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
                        >
                            <StickyNote2 sx={{ fontSize: 16 }} />
                            Special Note:
                        </Typography>
                        <Typography variant="body2" color="#F57F17" fontStyle="italic">
                            {order.specialInstruction}
                        </Typography>
                    </Box>
                )}

                {/* Action Button */}
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={isPending ? <CheckCircle /> : <TaskAlt />}
                    sx={{
                        bgcolor: isPending ? "#4CAF50" : "#2196F3",
                        color: "#fff",
                        fontWeight: 600,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1rem",
                        "&:hover": {
                            bgcolor: isPending ? "#45a049" : "#1976D2",
                            transform: "scale(1.02)",
                        },
                        transition: "all 0.2s ease",
                    }}
                    onClick={handleAction}
                >
                    {isPending ? "Accept Order" : "Mark as Completed"}
                </Button>
            </CardContent>
        </Card>
    );
});

OrderCard.displayName = "OrderCard";

export default OrderCard;