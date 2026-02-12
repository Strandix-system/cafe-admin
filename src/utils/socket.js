import { io } from "socket.io-client";

// Ensure there is NO /api at the end of this URL
const URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(URL, {
    autoConnect: true, //  Makes sure it tries to connect immediately
    transports: ["websocket"], //  Often more stable for Node.js backends
});