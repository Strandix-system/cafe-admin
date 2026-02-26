import { useEffect, useRef } from "react";
import { socket } from "../socket";
import { queryClient } from "../../lib/queryClient";
import toast from "react-hot-toast";
import { useNotificationSound } from "./useNotificationSound";

export const useOrdersRealtime = (userId) => {
  const playSound = useNotificationSound();
  const receivedOrderIds = useRef(new Set());

  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) socket.connect();
    socket.emit("join-admin", userId.toString());

    const onNewOrder = (order) => {
      if (order.orderStatus !== "pending") return;

      // 🔒 prevent duplicate sound
      if (receivedOrderIds.current.has(order._id)) return;
      receivedOrderIds.current.add(order._id);

      playSound();
      toast.success("New order received!");

      // 🔥 Update React Query cache
      queryClient.setQueryData(["get-all-orders"], (old) => {
        if (!old?.result?.results) return old;

        const exists = old.result.results.some(o => o._id === order._id);
        if (exists) return old;

        return {
          ...old,
          result: {
            ...old.result,
            results: [order, ...old.result.results],
          },
        };
      });
    };

    const onStatusUpdate = ({ orderId, status, order }) => {
      queryClient.setQueryData(["get-all-orders"], (old) => {
        if (!old?.result?.results) return old;

        return {
          ...old,
          result: {
            ...old.result,
            results: old.result.results.map(o =>
              o._id === orderId ? order : o
            ),
          },
        };
      });
    };

    socket.on("order:new", onNewOrder);
    socket.on("order:statusUpdated", onStatusUpdate);

    return () => {
      socket.off("order:new", onNewOrder);
      socket.off("order:statusUpdated", onStatusUpdate);
    };
  }, [userId, playSound]);
};