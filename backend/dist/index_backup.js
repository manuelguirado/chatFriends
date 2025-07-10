"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectDatabase_1 = require("./connectDatabase");
const next_1 = __importDefault(require("next"));
const messages_1 = require("./models/messages");
const utils_1 = require("./utils/utils");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = (0, next_1.default)({ dev, hostname, port });
const handle = app.getRequestHandler();
(0, connectDatabase_1.connectDatabase)()
    .then(() => {
    console.log("Database connected successfully");
})
    .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1);
});
app
    .prepare()
    .then(() => {
    const httpServer = (0, http_1.createServer)(handle);
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", async (Socket) => {
        console.log("A user connected:", Socket.id);
        // Eventos existentes
        Socket.on("joinChat", async (chatID) => {
            const messages = await (0, utils_1.recoverChatMessages)(chatID);
            Socket.join(chatID);
            console.log(`User joined chat: ${chatID}`);
            Socket.emit("chatMessages", messages);
        });
        // Nuevo evento para mensajes simples (V3.0)
        Socket.on("message", async (messageContent) => {
            console.log("📨 Mensaje recibido:", messageContent);
            // Crear mensaje mock para testing
            const message = {
                id: Date.now().toString(),
                content: messageContent,
                sender: "contact",
                timestamp: new Date()
            };
            // Reenviar a todos los clientes conectados
            io.emit("message", message);
        });
        // Cargar mensajes para un email específico
        Socket.on("loadMessages", async (email) => {
            console.log("📋 Cargando mensajes para:", email);
            // Mock messages para testing
            const mockMessages = [
                {
                    id: "1",
                    content: "¡Hola! 👋",
                    sender: "contact",
                    timestamp: new Date()
                },
                {
                    id: "2",
                    content: "¿Cómo estás?",
                    sender: "contact",
                    timestamp: new Date()
                }
            ];
            Socket.emit("loadMessagesResponse", mockMessages);
        });
        Socket.on("SendMessage", async (data) => {
            // ...existing code...
        });
        try {
            const message = new messages_1.Message({
                chatID: new mongoose_1.default.Types.ObjectId(data.chatID),
                content: data.content,
                idUser: data.idUser
                    ? new mongoose_1.default.Types.ObjectId(data.idUser)
                    : undefined,
                TimeStamp: new Date(),
            });
            await message.save();
            console.log("Message saved:", message);
            // Emit the new message to all clients in the chat room
            io.to(data.chatID).emit("newMessage", message);
            // Update the readBy field for the message
            (0, utils_1.updateReadby)(data.chatID, message.readyBy, data.idUser, Socket.id);
            console.log("Message readBy updated:", message._id);
        }
        catch (error) {
            console.error("Error sending message:", error);
        }
    });
    Socket.on("offline", async (chatID) => {
        try {
            const message = `User is offline in chat: ${chatID}`;
            (0, utils_1.saveMessageTolocalStorage)(message);
            console.log("Message saved to local storage:", message);
            io.to(chatID).emit("userOffline", { chatID, message });
            const messages = await (0, utils_1.recoverChatMessages)(chatID);
            Socket.emit("chatMessages", messages);
        }
        catch (error) {
            console.error("Error handling offline event:", error);
        }
    });
    Socket.on("disconnect", () => {
        console.log("A user disconnected");
        Socket.leave(Socket.id);
    });
});
httpServer
    .once("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
})
    .listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
});
try { }
catch () { }
(error) => {
    console.error("Error during app preparation:", error);
    process.exit(1);
};
;
