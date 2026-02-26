import React, { useState, useEffect, useRef, useMemo } from "react";
import { Box, Tabs, Tab, Typography, Grid, Badge, Chip } from "@mui/material";
import { useFetch, usePatch } from "../utils/hooks/api_hooks";
import { Loader } from "../components/common/Loader";
import { OrderCard } from "../components/OrderComponent/OrderCard";
import { TableComponent } from "../components/TableComponent/TableComponent";
import { API_ROUTES } from "../utils/api_constants";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { socket } from "../utils/socket";
import { DollarSign, Eye } from "lucide-react";
import { queryClient } from "../lib/queryClient";
import OrderBillModal from "../components/OrderComponent/OrderBillModal";

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`order-tabpanel-${index}`}
            aria-labelledby={`order-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export const OrderManagementPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [tabValue, setTabValue] = useState(0);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [acceptedOrders, setAcceptedOrders] = useState([]);

    const [isBillOpen, setIsBillOpen] = useState(false);
    const [selectedBillId, setSelectedBillId] = useState(null);

    const hasInitialized = useRef(false); // Track if we've initialized

    /* ---------------- INITIAL API LOAD ---------------- */
    const { data: ordersData, isLoading } = useFetch(
        "get-all-orders",
        API_ROUTES.getAllOrders,
        {},
        { refetchOnWindowFocus: true } // Changed to true to sync on window focus
    );

    /* ---------------- INITIALIZE STATE ONCE ---------------- */
    useEffect(() => {
        if (!ordersData?.result?.results) return;

        // Only initialize once on mount
        if (!hasInitialized.current) {
            const orders = ordersData.result.results;

            setPendingOrders(orders.filter(o => o.orderStatus === "pending"));
            setAcceptedOrders(orders.filter(o => o.orderStatus === "accepted"));
            hasInitialized.current = true;
        } else {
            // When coming back, sync with server data
            const orders = ordersData.result.results;

            // Update based on actual server status
            setPendingOrders(orders.filter(o => o.orderStatus === "pending"));
            setAcceptedOrders(orders.filter(o => o.orderStatus === "accepted"));
        }
    }, [ordersData]);

    /* ---------------- SOCKET CONNECT ---------------- */
    useEffect(() => {
        if (!user?.id) return;

        socket.connect();
        socket.emit("join-admin", user.id.toString());

        return () => {
            socket.off();
            socket.disconnect();
        };
    }, [user?.id]);

    /* ---------------- SOCKET LISTENERS ---------------- */
    useEffect(() => {
        const handleNewOrder = (order) => {
            if (order.orderStatus !== "pending") return;

            setPendingOrders(prev => {
                const exists = prev.find(o => o._id === order._id);
                return exists ? prev : [order, ...prev];
            });
            toast.success("New order received!");
        };

        const handleStatusUpdate = ({ orderId, status, order }) => {
            if (status === "accepted") {
                setPendingOrders((prev) => prev.filter((o) => o._id !== orderId));
                setAcceptedOrders((prev) => {
                    // Remove any existing version and add the updated one
                    const filtered = prev.filter((o) => o._id !== orderId);
                    return [order, ...filtered];
                });
            } else if (status === "completed") {
                setPendingOrders((prev) => prev.filter((o) => o._id !== orderId));
                setAcceptedOrders((prev) => prev.filter((o) => o._id !== orderId));
            }
        };

        socket.on("order:new", handleNewOrder);
        socket.on("order:statusUpdated", handleStatusUpdate);

        return () => {
            socket.off("order:new", handleNewOrder);
            socket.off("order:statusUpdated", handleStatusUpdate);
        };
    }, []);

    /* ---------------- UPDATE ORDER API ---------------- */
    const { mutate: updateOrder } = usePatch(API_ROUTES.updateOrder, {
        onSuccess: () => {
            toast.success("Order updated!");
            queryClient.invalidateQueries({ queryKey: "get-all-orders" });
        },
        onError: (error) => {
            toast.error(error);
            queryClient.invalidateQueries({ queryKey: "get-all-orders" });
        },
    });

    /* ---------------- UPDATE PAYMENT STATUS API ---------------- */
    const { mutate: updatePaymentStatus } = usePatch(API_ROUTES.updatePaymentStatus, {
        onSuccess: () => {
            toast.success("Payment status updated to Paid!");
            queryClient.invalidateQueries({ queryKey: ["get-all-orders"] });
        },
        onError: (error) => {
            toast.error(error);
            queryClient.invalidateQueries({ queryKey: ["get-all-orders"] });
        },
    });

    /* ---------------- ACTIONS ---------------- */
    const handleAcceptOrder = (orderId) => {
        const orderToMove = pendingOrders.find(o => o._id === orderId);
        if (!orderToMove) return;

        // Optimistic update - FIXED: was o.id, should be o._id
        setPendingOrders(prev => prev.filter(o => o._id !== orderId));
        setAcceptedOrders(prev => [...prev, { ...orderToMove, orderStatus: "accepted" }]);

        updateOrder({ orderId, orderStatus: "accepted" });
    };

    const handleCompleteOrder = (orderId) => {
        setAcceptedOrders((prev) => prev.filter((o) => o._id !== orderId));
        updateOrder({ orderId, orderStatus: "completed" });
    };

    const handleOpenBill = (row) => {
        setSelectedBillId(row._id);   // or row.billId depending on your backend
        setIsBillOpen(true);
    };

    /* ---------------- ORDER HISTORY TABLE CONFIG ---------------- */
    const historyColumns = useMemo(
        () => [
            {
                id: "customerName",
                header: "Customer Name",
                Cell: ({ row }) => {
                    const name = row.original.userId?.name || "";
                    return name.charAt(0).toUpperCase() + name.slice(1);
                },
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
                                    : row.original.orderStatus === "accepted"
                                        ? "#D1E7FF"
                                        : "#D1FFBE",
                            color:
                                row.original.orderStatus === "pending"
                                    ? "#856404"
                                    : row.original.orderStatus === "accepted"
                                        ? "#004085"
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

    const historyActions = [
        {
            label: "View Bill",
            icon: Eye,
            onClick: (row) => handleOpenBill(row.original)
        },
        {
            label: "Mark as Paid",
            icon: DollarSign,
            onClick: (row) => {
                if (!row.original.paymentStatus) {
                    updatePaymentStatus({
                        orderId: row.original._id,
                        paymentStatus: true
                    });
                }
            },
            disabled: (row) => row.original.paymentStatus, // Disable if already paid
        },
    ];

    const renderOrderCards = (orders, isPending) => (
        <Grid container spacing={3}>
            {orders.map(order => (
                <Grid item xs={12} sm={6} md={4} key={order._id}>
                    <OrderCard
                        order={order}
                        isPending={isPending}
                        onAccept={handleAcceptOrder}
                        onComplete={handleCompleteOrder}
                    />
                </Grid>
            ))}
        </Grid>
    );

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Loader variant="spinner" />
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", bgcolor: "#FAF7F2", minHeight: "100vh", p: 3 }}>
            <Typography variant="h4" fontWeight={700} color="#6F4E37" mb={3}>
                Order Management
            </Typography>

            <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                aria-label="order management tabs"
                sx={{
                    "& .MuiTab-root": { color: "#6F4E37", fontWeight: 600 },
                    "& .MuiTabs-indicator": { bgcolor: "#6F4E37" },
                }}
            >
                <Tab label={<Badge badgeContent={pendingOrders.length} color="error">Pending Orders</Badge>} />
                <Tab label={<Badge badgeContent={acceptedOrders.length} color="primary">Accepted Orders</Badge>} />
                <Tab label="History" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                {pendingOrders.length > 0
                    ? renderOrderCards(pendingOrders, true)
                    : <Typography>No pending orders.</Typography>}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                {acceptedOrders.length > 0
                    ? renderOrderCards(acceptedOrders, false)
                    : <Typography>No accepted orders.</Typography>}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Box>
                    <Typography variant="h6" color="#6F4E37" mb={2}>
                        Order History
                    </Typography>
                    <TableComponent
                        slug="orders"
                        columns={historyColumns}
                        actions={historyActions}
                        params={{
                            populate: "userId",
                        }}
                        actionsType="menu"
                        querykey="get-all-orders"
                        getApiEndPoint="getAllOrders"
                        deleteAction={false}
                        enableExportTable={true}
                    />
                </Box>
            </TabPanel>
            {isBillOpen && selectedBillId && (
                <OrderBillModal
                    open={isBillOpen}
                    onClose={() => {
                        setIsBillOpen(false);
                        setSelectedBillId(null);
                    }}
                    billId={selectedBillId}
                />
            )}
        </Box>

    );
};

