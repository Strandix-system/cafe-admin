import { useParams } from "react-router-dom";
import { useMemo } from "react";
import {TableComponent} from "../../components/TableComponent/TableComponent";
import { Box, Chip, Typography, Paper } from "@mui/material";

export const MyOrders = () => {
    const { userId } = useParams();

    const columns = useMemo(
        () => [
            {
                accessorKey: "tableNumber",
                header: "Table No",
                Cell: ({ cell }) => (
                    <Box
                        sx={{
                            backgroundColor: "#EEF2FF",
                            color: "#3730A3",
                            px: 2,
                            py: 0.5,
                            borderRadius: 3,
                            fontWeight: 600,
                            display: "inline-block",
                            minWidth: 50,
                            textAlign: "center",
                        }}
                    >
                        {cell.getValue() || "-"}
                    </Box>
                ),
            },
            {
                header: "Items",
                Cell: ({ row }) => {
                    const items = row.original.items || [];

                    if (!items.length) {
                        return (
                            <Typography variant="body2" color="text.secondary">
                                No Items
                            </Typography>
                        );
                    }

                    return (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {items.map((item) => (
                                <Box
                                    key={item._id}
                                    sx={{
                                        backgroundColor: "#F9FAFB",
                                        px: 2,
                                        py: 1,
                                        borderRadius: 2,
                                        fontSize: 13,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        border: "1px solid #E5E7EB",
                                    }}
                                >
                                    <Typography fontSize={13}>
                                        {item.name}
                                    </Typography>
                                    <Chip
                                        label={`x${item.quantity}`}
                                        size="small"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    );
                },
            },
            {
                accessorKey: "totalAmount",
                header: "Total Amount",
                Cell: ({ cell }) => (
                    <Typography fontWeight={700} color="#16A34A">
                        ₹ {Number(cell.getValue() || 0).toLocaleString()}
                    </Typography>
                ),
            },
            {
                accessorKey: "orderStatus",
                header: "Order Status",
                Cell: ({ cell }) => {
                    const status = cell.getValue();

                    const colorMap = {
                        Pending: "warning",
                        Preparing: "info",
                        Completed: "success",
                        Cancelled: "error",
                    };

                    return (
                        <Chip
                            label={status}
                            color={colorMap[status] || "default"}
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                    );
                },
            },
            {
                accessorKey: "paymentStatus",
                header: "Payment",
                Cell: ({ cell }) =>
                    cell.getValue() ? (
                        <Chip label="Paid" color="success" size="small" />
                    ) : (
                        <Chip label="Pending" color="warning" size="small" />
                    ),
            },
            {
                accessorKey: "createdAt",
                header: "Ordered At",
                Cell: ({ cell }) => {
                    const date = new Date(cell.getValue());

                    return (
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                {date.toLocaleDateString("en-IN")}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {date.toLocaleTimeString("en-IN")}
                            </Typography>
                        </Box>
                    );
                },
            },
        ],
        []
    );

    if (!userId) {
        return (
            <Box p={4}>
                <Typography color="error">
                    Invalid user ID
                </Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            {/* Page Header */}
            <Box mb={3}>
                <Typography variant="h6" fontWeight={700}>
                    Customer Orders
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Order history for selected customer
                </Typography>
            </Box>

            {/* Table Card Container */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid #E5E7EB",
                }}
            >
                <TableComponent
                    slug="Orders"
                    columns={columns}
                    params={{ userId }}
                    querykey={`myOrders-${userId}`}
                    getApiEndPoint="myOrders"
                    deleteAction={false}
                />
            </Paper>
        </Box>
    );
};


