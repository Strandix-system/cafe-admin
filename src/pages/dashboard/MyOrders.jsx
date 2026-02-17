import { useParams } from "react-router-dom";
import { useMemo } from "react";
import TableComponent from "../../components/TableComponent/TableComponent";
import { Box, Chip, Typography } from "@mui/material";

const MyOrders = () => {
    const { userId } = useParams();

    const columns = useMemo(
        () => [
            // Table Number
            {
                accessorKey: "tableNumber",
                header: "Table No",
                Cell: ({ cell }) => (
                    <Box
                        sx={{
                            backgroundColor: "#F5F5F5",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            display: "inline-block",
                            minWidth: 40,
                            textAlign: "center",
                        }}
                    >
                        {cell.getValue() || "-"}
                    </Box>
                ),
            },

            // Items
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
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                            {items.map((item) => (
                                <Box
                                    key={item._id}
                                    sx={{
                                        backgroundColor: "#FAFAFA",
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 1,
                                        fontSize: 13,
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <span>{item.name}</span>
                                    <strong>x{item.quantity}</strong>
                                </Box>
                            ))}
                        </Box>
                    );
                },
            },

            // Amount
            {
                accessorKey: "totalAmount",
                header: "Total Amount",
                Cell: ({ cell }) => (
                    <Typography fontWeight={600} color="#2E7D32">
                        ₹{cell.getValue()?.toLocaleString()}
                    </Typography>
                ),
            },

            // Order Status
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

            // Payment Status
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

            // Date
            {
                accessorKey: "createdAt",
                header: "Created At",
                Cell: ({ cell }) => {
                    const date = new Date(cell.getValue());

                    return (
                        <Box>
                            <Typography variant="body2" fontWeight={500}>
                                {date.toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {date.toLocaleTimeString()}
                            </Typography>
                        </Box>
                    );
                },
            },
        ],
        []
    );

    return (
        <TableComponent
            slug="Orders"
            columns={columns}
            params={{ userId }}
            querykey={`myOrders-${userId}`}
            getApiEndPoint={"myOrders"}
            deleteAction={false}
        />
    );
};

export default MyOrders;
