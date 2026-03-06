import { createContext, useContext, useEffect, useState } from "react";
import { useFetch, usePatch } from "../utils/hooks/api_hooks";
import { API_ROUTES } from "../utils/api_constants";
import { socket } from "../utils/socket";
import { useAuth } from "./AuthContext";
import { useRef } from "react";
import { queryClient } from "../lib/queryClient";
import toast from "react-hot-toast";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
    };
  }, []);
  const audioRef = useRef(null);
  const { user } = useAuth();

  const [pendingOrders, setPendingOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);

  /* ---------------- FETCH ORDERS ---------------- */
  const { data } = useFetch(
    "get-all-orders",
    API_ROUTES.getAllOrders,
    {},
    { enabled: !!user?.id },
  );

  /* ---------------- INITIAL SYNC ---------------- */
  useEffect(() => {
    if (!data?.result?.results) return;

    const orders = data.result.results;

    setPendingOrders(orders.filter((o) => o.orderStatus === "pending"));
    setAcceptedOrders(orders.filter((o) => o.orderStatus === "accepted"));
  }, [data]);

  /* ---------------- SOCKET CONNECT ---------------- */
  useEffect(() => {
    if (!user?.id) return;

    socket.emit("join-admin", user.id.toString());

    const handleNewOrder = (order) => {
      if (order.orderStatus !== "pending") return;

      setPendingOrders((prev) => {
        const exists = prev.some((o) => o._id === order._id);
        if (exists) return prev;

        const audio = new Audio("/sounds/new.mp3");
        audio.volume = 1;
        audio.play().catch((err) => {
          console.log("Sound blocked:", err);
        });
        toast.success(`New Order for Table ${order.tableNumber}`);
        return [order, ...prev];
      });
    };

    const handleStatusUpdate = ({ orderId, status, order }) => {
      if (status === "accepted") {
        setPendingOrders((prev) => prev.filter((o) => o._id !== orderId));
        setAcceptedOrders((prev) => [order, ...prev]);
      }

      if (status === "completed") {
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
  }, [user?.id]);

  /* ---------------- UPDATE ORDER ---------------- */
  const { mutate: updateOrder } = usePatch(API_ROUTES.updateOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "get-all-orders" });
    },
  });

  const acceptOrder = (orderId) => {
    const order = pendingOrders.find((o) => o._id === orderId);
    if (!order) return;

    // optimistic update
    setPendingOrders((prev) => prev.filter((o) => o._id !== orderId));
    setAcceptedOrders((prev) => [
      { ...order, orderStatus: "accepted" },
      ...prev,
    ]);

    updateOrder({ orderId, orderStatus: "accepted" });
  };

  const completeOrder = (orderId) => {
    setAcceptedOrders((prev) => prev.filter((o) => o._id !== orderId));

    updateOrder({ orderId, orderStatus: "completed" });
  };
  return (
    <OrderContext.Provider
      value={{
        pendingOrders,
        acceptedOrders,
        acceptOrder,
        completeOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
