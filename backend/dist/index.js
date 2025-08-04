"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userOnline_1 = require("./utils/userOnline");
const connectDatabase_1 = require("./connectDatabase");
const messages_1 = require("./models/messages");
const chatUtils_1 = require("./utils/chatUtils");
const recoverMessages_1 = require("./utils/recoverMessages");
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Configurar Socket.io
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // Tu frontend
        methods: ["GET", "POST"],
    },
});
// Conectar base de datos
(0, connectDatabase_1.connectDatabase)()
    .then(() => {
    console.log("✅ Database connected successfully");
})
    .catch((error) => {
    console.error("❌ Error connecting to the database:", error);
    process.exit(1);
});
// Socket.io eventos
io.on("connection", async (socket) => {
    console.log("🔌 A user connected:", socket.id);
    let currentUserEmail = null;
    // ✅ Autenticación del usuario
    socket.on("authenticate", (userEmail) => {
        console.log("🔐 Authenticating user:", userEmail);
        if (!userEmail || typeof userEmail !== 'string') {
            console.log("❌ Invalid userEmail:", userEmail);
            socket.emit("error", "Invalid user email");
            return;
        }
        currentUserEmail = userEmail;
        console.log("✅ User authenticated:", userEmail);
        // Marcar usuario como online
        (0, userOnline_1.setUserOnline)(userEmail);
        // Emitir lista actualizada de usuarios online a todos los clientes
        io.emit("onlineUsers", (0, userOnline_1.getOnlineUsers)());
        // Confirmar autenticación al frontend
        socket.emit("authenticated", { userEmail });
    });
    // ✅ Unirse a un chat específico
    socket.on("joinChat", async (contactEmail) => {
        console.log("🔍 joinChat called with:", { currentUserEmail, contactEmail });
        if (!currentUserEmail) {
            console.log("❌ User not authenticated for joinChat");
            socket.emit("error", "User not authenticated");
            return;
        }
        if (!contactEmail || typeof contactEmail !== 'string') {
            console.log("❌ Invalid contactEmail:", contactEmail);
            socket.emit("error", "Invalid contact email");
            return;
        }
        // ✅ Validación adicional de currentUserEmail antes de usar
        if (!currentUserEmail || typeof currentUserEmail !== 'string') {
            console.log("❌ Invalid currentUserEmail state:", currentUserEmail);
            socket.emit("error", "Invalid current user email state");
            return;
        }
        try {
            console.log("🔧 Generating chatID with:", { currentUserEmail, contactEmail });
            const chatID = (0, chatUtils_1.generateChatID)(currentUserEmail, contactEmail);
            const participants = (0, chatUtils_1.getParticipants)(currentUserEmail, contactEmail);
            // Unirse a la sala del chat
            socket.join(chatID);
            console.log(`👥 User ${currentUserEmail} joined chat: ${chatID}`);
            // Cargar mensajes históricos
            const messages = await messages_1.Message.find({ chatID })
                .sort({ timestamp: 1 })
                .limit(50) // ✅ Limitar para performance
                .lean(); // ✅ Mejor performance
            console.log(`📋 Loaded ${messages.length} messages for chat: ${chatID}`);
            if (messages.length > 0) {
                // ✅ Enviar mensajes al cliente
                socket.emit("chatMessages", messages);
            }
            else {
                socket.emit("chatMessages", []);
            }
            socket.emit("chatJoined", { chatID, participants });
        }
        catch (error) {
            console.error("❌ Error joining chat:", error);
            socket.emit("error", "Failed to join chat");
        }
    });
    // ✅ Enviar mensaje optimizado
    socket.on("sendMessage", async (data) => {
        if (!currentUserEmail) {
            socket.emit("error", "User not authenticated");
            return;
        }
        // ✅ Validar data completa
        if (!data || !data.contactEmail || !data.content) {
            console.log("❌ Invalid message data:", data);
            socket.emit("error", "Invalid message data");
            return;
        }
        if (typeof data.contactEmail !== 'string' || typeof data.content !== 'string') {
            console.log("❌ Invalid data types:", data);
            socket.emit("error", "Invalid message data types");
            return;
        }
        // ✅ Validación adicional de currentUserEmail
        if (!currentUserEmail || typeof currentUserEmail !== 'string') {
            console.log("❌ Invalid currentUserEmail state in sendMessage:", currentUserEmail);
            socket.emit("error", "Invalid current user email state");
            return;
        }
        try {
            const chatID = (0, chatUtils_1.generateChatID)(currentUserEmail, data.contactEmail);
            const participants = (0, chatUtils_1.getParticipants)(currentUserEmail, data.contactEmail);
            const message = new messages_1.Message({
                chatID,
                participants,
                senderEmail: currentUserEmail,
                content: data.content,
                timestamp: new Date(),
                readBy: [currentUserEmail], // ✅ Marcar como leído por el sender
            });
            await message.save();
            console.log("💾 Message saved:", message._id);
            // ✅ Enviar a todos en la sala del chat
            io.to(chatID).emit("newMessage", {
                id: message._id.toString(),
                content: message.content,
                senderEmail: message.senderEmail,
                timestamp: message.timestamp,
                chatID: message.chatID
            });
        }
        catch (error) {
            console.error("❌ Error sending message:", error);
            socket.emit("error", "Failed to send message");
        }
    });
    // ✅ Marcar mensajes como leídos
    socket.on("markAsRead", async (data) => {
        if (!currentUserEmail)
            return;
        try {
            await messages_1.Message.updateMany({
                chatID: data.chatID,
                readBy: { $ne: currentUserEmail } // ✅ Solo si no está ya marcado
            }, {
                $addToSet: { readBy: currentUserEmail } // ✅ Evitar duplicados
            });
            // Notificar a otros participantes
            socket.to(data.chatID).emit("messagesRead", {
                chatID: data.chatID,
                readBy: currentUserEmail
            });
        }
        catch (error) {
            console.error("❌ Error marking as read:", error);
        }
    });
    socket.on("loadChatMessages", async (chatID) => {
        if (!currentUserEmail) {
            socket.emit("error", "User not authenticated");
            return;
        }
        try {
            const messages = await (0, recoverMessages_1.recoverChatMessages)(chatID, currentUserEmail);
            if (messages.length > 0) {
                socket.emit("chatMessages", messages);
            }
            else {
                socket.emit("chatMessages", []);
            }
            console.log(`📋 Loaded ${messages.length} messages for chat: ${chatID}`);
        }
        catch (error) {
            console.error("❌ Error loading chat messages:", error);
            socket.emit("error", "Failed to load chat messages");
        }
    });
    // ✅ Manejo de desconexión
    socket.on("disconnect", () => {
        console.log("🔌 User disconnected:", socket.id);
        if (currentUserEmail) {
            // Marcar usuario como offline
            (0, userOnline_1.setUserOffline)(currentUserEmail);
            // Emitir lista actualizada de usuarios online a todos los clientes
            io.emit("onlineUsers", (0, userOnline_1.getOnlineUsers)());
            console.log(`❌ User ${currentUserEmail} set offline`);
        }
    });
});
// Iniciar servidor
const PORT = 4000; // Puerto diferente al frontend
const HOST = process.env.HOST || 'localhost';
httpServer.listen(PORT, () => {
    console.log(`🚀 Socket.io server running on http://${HOST}:${PORT}`);
    console.log(`📡 WebSocket endpoint: ws://${HOST}:${PORT}/socket.io/`);
});
