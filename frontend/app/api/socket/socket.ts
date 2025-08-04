import { io, Socket } from "socket.io-client";

const socket: Socket = io("https://server.chatfriends.com", {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;