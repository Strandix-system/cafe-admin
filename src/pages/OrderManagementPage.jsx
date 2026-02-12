import React, { useState, useEffect, useRef } from "react";
import { Box, Tabs, Tab, Typography, Grid, Badge } from "@mui/material";
import { useFetch, usePatch } from "../utils/hooks/api_hooks";
import Loader from "../components/common/Loader";
import OrderCard from "../components/OderComponent/OrderCard";
import { API_ROUTES } from "../utils/api_constants";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { socket } from "../utils/socket";

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

const OrderManagementPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [tabValue, setTabValue] = useState(0);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [acceptedOrders, setAcceptedOrders] = useState([]);
    const hasInitialized = useRef(false); // Track if we've initialized

    /* ---------------- INITIAL API LOAD ---------------- */
    const { data: ordersData, isLoading, refetch } = useFetch(
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
            // Refetch to sync with backend
            refetch();
        },
        onError: () => {
            toast.error("Failed to update order");
            // Refetch to restore correct state
            refetch();
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
                <Tab label="History" onClick={() => navigate("/order-history")} />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" color="#6F4E37" mb={2}>
                    Pending Orders
                </Typography>
                {pendingOrders.length > 0
                    ? renderOrderCards(pendingOrders, true)
                    : <Typography>No pending orders.</Typography>}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" color="#6F4E37" mb={2}>
                    Accepted Orders
                </Typography>
                {acceptedOrders.length > 0
                    ? renderOrderCards(acceptedOrders, false)
                    : <Typography>No accepted orders.</Typography>}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Typography sx={{ cursor: "pointer", color: "#6F4E37", textDecoration: "underline" }}>
                    View Order History
                </Typography>
            </TabPanel>
        </Box>
    );
};

export default OrderManagementPage;