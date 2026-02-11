import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography, Grid, Badge } from "@mui/material";
import { io } from "socket.io-client";
import { useFetch, usePatch } from "../utils/hooks/api_hooks";
import { queryClient } from "../lib/queryClient";
import Loader from "../components/common/Loader";
import OrderCard from "../components/OderComponent/OrderCard";
import { API_ROUTES } from "../utils/api_constants";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const socket = io(import.meta.env.VITE_SOCKET_URL);

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
    const [tabValue, setTabValue] = useState(0);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [acceptedOrders, setAcceptedOrders] = useState([]);

    const { data: ordersData, isLoading } = useFetch(
        "get-all-orders",
        API_ROUTES.getAllOrders,
        {},
        { refetchOnWindowFocus: false }
    );

    // ✅ FIX: Remove orderId from first parameter, it will come from variables
    const { mutate: updateOrder } = usePatch(
        API_ROUTES.updateOrder, // ✅ Base URL only
        {
            onSuccess: () => {
                toast.success("Order updated!");
                queryClient.invalidateQueries({ queryKey: ["get-all-orders"] });
            },
            onError: (error, variables) => {
                console.error("Failed to update order:", error);
                toast.error("Failed to update order. Please try again.");

                // ✅ Rollback based on what was attempted
                if (variables.orderStatus === "accepted") {
                    const orderToRollback = acceptedOrders.find((order) => order._id === variables.orderId);
                    if (orderToRollback) {
                        setAcceptedOrders((prev) => prev.filter((order) => order._id !== variables.orderId));
                        setPendingOrders((prev) => [...prev, { ...orderToRollback, orderStatus: "pending" }]);
                    }
                } else if (variables.orderStatus === "completed") {
                    // Rollback completed back to accepted
                    const orderToRollback = pendingOrders.find((order) => order._id === variables.orderId)
                        || acceptedOrders.find((order) => order._id === variables.orderId);
                    if (orderToRollback) {
                        setAcceptedOrders((prev) => [...prev, { ...orderToRollback, orderStatus: "accepted" }]);
                    }
                }
            },
        }
    );

    // ✅ Initialize orders from API
    useEffect(() => {
        if (ordersData?.result?.results) {
            const orders = ordersData.result.results;
            setPendingOrders(orders.filter((order) => order.orderStatus === "pending"));
            setAcceptedOrders(orders.filter((order) => order.orderStatus === "accepted"));
        }
    }, [ordersData]);

    // ✅ Socket connection management (SINGLE useEffect)
    useEffect(() => {
        const handleConnect = () => {
            console.log("Socket connected");
            const adminId = localStorage.getItem("adminId");
            if (adminId) {
                socket.emit("join-admin", adminId);
            }
        };

        const handleDisconnect = () => {
            console.log("Socket disconnected");
            toast.error("Connection lost. Reconnecting...");
        };

        const handleReconnect = () => {
            console.log("Socket reconnected");
            toast.success("Connection restored!");
            queryClient.invalidateQueries({ queryKey: ["get-all-orders"] });
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("reconnect", handleReconnect);

        // Initial connection
        if (socket.connected) {
            handleConnect();
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("reconnect", handleReconnect);
        };
    }, []);

    // ✅ Socket event listeners (SINGLE useEffect - removed duplicates)
    useEffect(() => {
        const handleNewOrder = (order) => {
            console.log("Received new order via socket:", order);

            if (order.orderStatus === "pending") {
                setPendingOrders((prev) => {
                    const exists = prev.find((o) => o._id === order._id);
                    if (exists) return prev;
                    return [order, ...prev];
                });
                toast.success("New order received!");
            }
        };

        const handleOrderStatusUpdate = ({ orderId, status, order }) => {
            console.log("Order status updated:", { orderId, status });

            if (status === "accepted") {
                setPendingOrders((prev) => prev.filter((o) => o._id !== orderId));
                setAcceptedOrders((prev) => {
                    const exists = prev.find((o) => o._id === orderId);
                    if (exists) {
                        return prev.map((o) => o._id === orderId ? order : o);
                    }
                    return [order, ...prev];
                });
            } else if (status === "completed") {
                setAcceptedOrders((prev) => prev.filter((o) => o._id !== orderId));
                toast.success("Order completed!");
            } else if (status === "pending") {
                setAcceptedOrders((prev) => prev.filter((o) => o._id !== orderId));
                setPendingOrders((prev) => {
                    const exists = prev.find((o) => o._id === orderId);
                    if (exists) return prev;
                    return [order, ...prev];
                });
            }
        };

        socket.on("newOrder", handleNewOrder);
        socket.on("orderStatusUpdate", handleOrderStatusUpdate);

        return () => {
            socket.off("newOrder", handleNewOrder);
            socket.off("orderStatusUpdate", handleOrderStatusUpdate);
        };
    }, []);

    const handleAcceptOrder = (orderId) => {
        const orderToMove = pendingOrders.find((o) => o._id === orderId);
        if (orderToMove) {
            setPendingOrders((prev) => prev.filter((o) => o._id !== orderId));
            setAcceptedOrders((prev) => [...prev, { ...orderToMove, orderStatus: "accepted" }]);
        }
        // ✅ Pass orderId in the data object
        updateOrder({ orderId, orderStatus: "accepted" });
    };

    const handleCompleteOrder = (orderId) => {
        setAcceptedOrders((prev) => prev.filter((o) => o._id !== orderId));
        // ✅ Pass orderId in the data object
        updateOrder({ orderId, orderStatus: "completed" });
    };

    const renderOrderCards = (orders, isPending) => (
        <Grid container spacing={3}>
            {orders.map((order) => (
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
                {pendingOrders.length > 0 ? renderOrderCards(pendingOrders, true) : <Typography>No pending orders.</Typography>}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" color="#6F4E37" mb={2}>
                    Accepted Orders
                </Typography>
                {acceptedOrders.length > 0 ? renderOrderCards(acceptedOrders, false) : <Typography>No accepted orders.</Typography>}
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