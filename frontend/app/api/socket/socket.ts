import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:4000", {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;