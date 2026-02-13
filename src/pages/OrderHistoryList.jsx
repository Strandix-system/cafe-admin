import TableComponent from "../components/TableComponent/TableComponent";
import { Box, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import { useMemo } from "react";

const OrderHistoryList = () => {
    const navigate = useNavigate();

    const columns = useMemo(
        () => [
            {
                id: "customerName",
                header: "Customer Name",
                Cell: ({ row }) => row.original.userId?.name.charAt(0).toUpperCase() + row.original.userId?.name.slice(1), // Change later to customerName if API sends it
            },
            {
                id: "itemName",
                header: "Item Name",
                Cell: ({ row }) =>
                    row.original.items?.map((item) => item.name).join(", "),
            },
            {
                accessorKey: "totalAmount",
                header: "Total Amount (₹)",
            },
            {
                id: "orderStatus",
                header: "Order Status",
                Cell: ({ row }) => (
                    <Chip
                        label={row.original.orderStatus}
                        size="small"
                        sx={{
                            backgroundColor:
                                row.original.orderStatus === "pending"
                                    ? "#FFF3CD"
                                    : "#D1FFBE",
                            color:
                                row.original.orderStatus === "pending"
                                    ? "#856404"
                                    : "#3DB309",
                        }}
                    />
                ),
            },
            {
                id: "paymentStatus",
                header: "Payment Status",
                Cell: ({ row }) => (
                    <Chip
                        label={row.original.paymentStatus ? "Paid" : "Unpaid"}
                        size="small"
                        sx={{
                            backgroundColor: row.original.paymentStatus
                                ? "#D1FFBE"
                                : "#FFDADA",
                            color: row.original.paymentStatus ? "#3DB309" : "#FF0000",
                        }}
                    />
                ),
            },
        ],
        []
    );

    const actions = [
        {
            label: "View",
            icon: Eye,
            onClick: (row) => {
                navigate(`/orders/view/${row.original._id}`);
            },
        },
    ];

    return (
        <div className="overflow-hidden">
            <Box
                sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="h6" fontWeight={600}>
                    Order History
                </Typography>
            </Box>

            <TableComponent
                slug="orders"
                columns={columns}
                actions={actions}
                params={{
                    populate: "userId",
                }}
                actionsType="menu"
                querykey="get-all-orders"
                getApiEndPoint="getAllOrders"
                deleteApiEndPoint="deleteOrder"
                deleteAction={false}
                enableExportTable={true}
            />
        </div>
    );
};

export default OrderHistoryList;