import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography, Grid, Badge } from "@mui/material";
import { io } from "socket.io-client";
import { useFetch } from "../utils/hooks/api_hooks";
import Loader from "../components/common/Loader";
import OrderCard from "../components/OderComponent/OrderCard"; // ← Import the new component
import { API_ROUTES } from "../utils/api_constants";
import { useNavigate } from "react-router-dom";

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
        {
            refetchOnWindowFocus: false,
        }
    );

    useEffect(() => {
        if (ordersData?.result?.results) {
            const orders = ordersData.result.results;
            setPendingOrders(orders.filter((order) => order.orderStatus === "pending"));
            setAcceptedOrders(orders.filter((order) => order.orderStatus === "accepted"));
        }
    }, [ordersData]);

    useEffect(() => {
        socket.on("newOrder", (order) => {
            if (order.orderStatus === "pending") {
                setPendingOrders((prev) => [...prev, order]);
            }
        });

        socket.on("orderAccepted", ({ orderId, order }) => {
            setPendingOrders((prev) => prev.filter((o) => o._id !== orderId));
            setAcceptedOrders((prev) => [...prev, { ...order, orderStatus: "accepted" }]);
        });

        socket.on("completeOrder", (orderId) => {
            setAcceptedOrders((prev) => prev.filter((o) => o._id !== orderId));
        });

        return () => {
            socket.off("newOrder");
            socket.off("orderAccepted");
            socket.off("completeOrder");
        };
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleAcceptOrder = (orderId) => {
        socket.emit("acceptOrder", { orderId });

        // Optimistic update
        const orderToMove = pendingOrders.find((o) => o._id === orderId);
        if (orderToMove) {
            setPendingOrders((prev) => prev.filter((o) => o._id !== orderId));
            setAcceptedOrders((prev) => [...prev, { ...orderToMove, orderStatus: "accepted" }]);
        }
    };

    const handleCompleteOrder = (orderId) => {
        socket.emit("completeOrder", { orderId });

        // Optimistic update
        setAcceptedOrders((prev) => prev.filter((o) => o._id !== orderId));
    };

    // Simplified render function
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
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
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
                onChange={handleTabChange}
                aria-label="order management tabs"
                sx={{
                    "& .MuiTab-root": { color: "#6F4E37", fontWeight: 600 },
                    "& .MuiTabs-indicator": { bgcolor: "#6F4E37" },
                }}
            >
                <Tab
                    label={
                        <Badge badgeContent={pendingOrders.length} color="error">
                            Pending Orders
                        </Badge>
                    }
                />
                <Tab
                    label={
                        <Badge badgeContent={acceptedOrders.length} color="primary">
                            Accepted Orders
                        </Badge>
                    }
                />
                <Tab label="History" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" color="#6F4E37" mb={2}>
                    Pending Orders
                </Typography>
                {pendingOrders.length > 0 ? (
                    renderOrderCards(pendingOrders, true)
                ) : (
                    <Typography>No pending orders.</Typography>
                )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" color="#6F4E37" mb={2}>
                    Accepted Orders
                </Typography>
                {acceptedOrders.length > 0 ? (
                    renderOrderCards(acceptedOrders, false)
                ) : (
                    <Typography>No accepted orders.</Typography>
                )}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Typography onClick={() => navigate("/order-history")} sx={{ cursor: "pointer", color: "#6F4E37", textDecoration: "underline" }}>
                    View Order History
                </Typography>
            </TabPanel>
        </Box>
    );
};

export default OrderManagementPage;