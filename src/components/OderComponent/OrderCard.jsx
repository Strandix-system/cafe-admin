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
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(111, 78, 55, 0.1)",
                border: "1px solid #F5EFE6",
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(111, 78, 55, 0.15)",
                },
            }}
        >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                {/* Header with Table Number and Action Button */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1.5,
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                            color: "#6F4E37",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                        }}
                    >
                        Table {order.tableNumber}
                    </Typography>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={isPending ? <CheckCircle /> : <TaskAlt />}
                        sx={{
                            bgcolor: isPending ? "#4CAF50" : "#2196F3",
                            color: "#fff",
                            fontWeight: 600,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1.5,
                            textTransform: "none",
                            fontSize: "0.813rem",
                            minWidth: "auto",
                            "&:hover": {
                                bgcolor: isPending ? "#45a049" : "#1976D2",
                            },
                        }}
                        onClick={handleAction}
                    >
                        {isPending ? "Accept" : "Complete"}
                    </Button>
                </Box>

                {/* Items List with Status Chip */}
                <Box sx={{ mb: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            color="#6F4E37"
                            sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: "0.875rem" }}
                        >
                            <LocalDining sx={{ fontSize: 16 }} />
                            Items:
                        </Typography>
                        <Chip
                            label={order.orderStatus.toUpperCase()}
                            size="small"
                            sx={{
                                bgcolor: isPending ? "#FFF3E0" : "#E8F5E9",
                                color: isPending ? "#F57C00" : "#2E7D32",
                                fontWeight: 600,
                                fontSize: "0.7rem",
                                height: 24,
                            }}
                        />
                    </Box>
                    {order.items?.map((item, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                py: 0.5,
                                px: 1,
                                bgcolor: "#FAF7F2",
                                borderRadius: 1,
                                mb: 0.5,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.813rem" }}>
                                {item.quantity} x {item.name}
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="#6F4E37" sx={{ fontSize: "0.813rem" }}>
                                ₹{item.price}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Special Instructions */}
                {order.specialInstruction && (
                    <Box
                        sx={{
                            bgcolor: "#FFF9C4",
                            p: 1,
                            borderRadius: 1,
                            mb: 1.5,
                            borderLeft: "3px solid #FBC02D",
                        }}
                    >
                        <Typography
                            variant="caption"
                            fontWeight={600}
                            color="#F57F17"
                            sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: "0.75rem" }}
                        >
                            <StickyNote2 sx={{ fontSize: 14 }} />
                            Special Note: {order.specialInstruction}
                        </Typography>
                    </Box>
                )}

                {/* Total Amount */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        bgcolor: "#F5EFE6",
                        p: 1,
                        borderRadius: 1.5,
                    }}
                >
                    <Typography variant="body2" fontWeight={600} color="#6F4E37">
                        Total Amount:
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="#6F4E37" sx={{ fontSize: "1.125rem" }}>
                        ₹{order.totalAmount}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
});

OrderCard.displayName = "OrderCard";

export default OrderCard;