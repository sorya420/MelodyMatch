import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL, {
  transports: ["websocket"], // ✅ avoid polling (less CORS headache)
});


export default socket;
