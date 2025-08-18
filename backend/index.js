"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var userOnline_1 = require("./utils/userOnline");
var connectDatabase_1 = require("./connectDatabase");
var messages_1 = require("./models/messages");
var chatUtils_1 = require("./utils/chatUtils");
var recoverMessages_1 = require("./utils/recoverMessages");
var dotenv_1 = require("dotenv");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var express_1 = require("express");
dotenv_1.default.config();
var app = (0, express_1.default)();
var httpServer = (0, http_1.createServer)(app);
// Configurar Socket.io
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "https://chat-friends-alpha.vercel.app", // Tu frontend
        methods: ["GET", "POST"],
    },
});
// Conectar base de datos
(0, connectDatabase_1.connectDatabase)()
    .then(function () {
    console.log("✅ Database connected successfully");
})
    .catch(function (error) {
    console.error("❌ Error connecting to the database:", error);
    process.exit(1);
});
app.get("/", function (req, res) {
    res.send("👋 Welcome to the Chat Server!");
});
// Socket.io eventos
io.on("connection", function (socket) { return __awaiter(void 0, void 0, void 0, function () {
    var currentUserEmail;
    return __generator(this, function (_a) {
        console.log("🔌 A user connected:", socket.id);
        currentUserEmail = null;
        // ✅ Autenticación del usuario
        socket.on("authenticate", function (userEmail) {
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
            socket.emit("authenticated", { userEmail: userEmail });
        });
        // ✅ Unirse a un chat específico
        socket.on("joinChat", function (contactEmail) { return __awaiter(void 0, void 0, void 0, function () {
            var chatID, participants, messages, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("🔍 joinChat called with:", { currentUserEmail: currentUserEmail, contactEmail: contactEmail });
                        if (!currentUserEmail) {
                            console.log("❌ User not authenticated for joinChat");
                            socket.emit("error", "User not authenticated");
                            return [2 /*return*/];
                        }
                        if (!contactEmail || typeof contactEmail !== 'string') {
                            console.log("❌ Invalid contactEmail:", contactEmail);
                            socket.emit("error", "Invalid contact email");
                            return [2 /*return*/];
                        }
                        // ✅ Validación adicional de currentUserEmail antes de usar
                        if (!currentUserEmail || typeof currentUserEmail !== 'string') {
                            console.log("❌ Invalid currentUserEmail state:", currentUserEmail);
                            socket.emit("error", "Invalid current user email state");
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log("🔧 Generating chatID with:", { currentUserEmail: currentUserEmail, contactEmail: contactEmail });
                        chatID = (0, chatUtils_1.generateChatID)(currentUserEmail, contactEmail);
                        participants = (0, chatUtils_1.getParticipants)(currentUserEmail, contactEmail);
                        // Unirse a la sala del chat
                        socket.join(chatID);
                        console.log("\uD83D\uDC65 User ".concat(currentUserEmail, " joined chat: ").concat(chatID));
                        return [4 /*yield*/, messages_1.Message.find({ chatID: chatID })
                                .sort({ timestamp: 1 })
                                .limit(50) // ✅ Limitar para performance
                                .lean()];
                    case 2:
                        messages = _a.sent();
                        console.log("\uD83D\uDCCB Loaded ".concat(messages.length, " messages for chat: ").concat(chatID));
                        if (messages.length > 0) {
                            // ✅ Enviar mensajes al cliente
                            socket.emit("chatMessages", messages);
                        }
                        else {
                            socket.emit("chatMessages", []);
                        }
                        socket.emit("chatJoined", { chatID: chatID, participants: participants });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("❌ Error joining chat:", error_1);
                        socket.emit("error", "Failed to join chat");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // ✅ Enviar mensaje optimizado
        socket.on("sendMessage", function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var chatID, participants, message, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!currentUserEmail) {
                            socket.emit("error", "User not authenticated");
                            return [2 /*return*/];
                        }
                        // ✅ Validar data completa
                        if (!data || !data.contactEmail || !data.content) {
                            console.log("❌ Invalid message data:", data);
                            socket.emit("error", "Invalid message data");
                            return [2 /*return*/];
                        }
                        if (typeof data.contactEmail !== 'string' || typeof data.content !== 'string') {
                            console.log("❌ Invalid data types:", data);
                            socket.emit("error", "Invalid message data types");
                            return [2 /*return*/];
                        }
                        // ✅ Validación adicional de currentUserEmail
                        if (!currentUserEmail || typeof currentUserEmail !== 'string') {
                            console.log("❌ Invalid currentUserEmail state in sendMessage:", currentUserEmail);
                            socket.emit("error", "Invalid current user email state");
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        chatID = (0, chatUtils_1.generateChatID)(currentUserEmail, data.contactEmail);
                        participants = (0, chatUtils_1.getParticipants)(currentUserEmail, data.contactEmail);
                        message = new messages_1.Message({
                            chatID: chatID,
                            participants: participants,
                            senderEmail: currentUserEmail,
                            content: data.content,
                            timestamp: new Date(),
                            readBy: [currentUserEmail], // ✅ Marcar como leído por el sender
                        });
                        return [4 /*yield*/, message.save()];
                    case 2:
                        _a.sent();
                        console.log("💾 Message saved:", message._id);
                        // ✅ Enviar a todos en la sala del chat
                        io.to(chatID).emit("newMessage", {
                            id: message._id.toString(),
                            content: message.content,
                            senderEmail: message.senderEmail,
                            timestamp: message.timestamp,
                            chatID: message.chatID
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error("❌ Error sending message:", error_2);
                        socket.emit("error", "Failed to send message");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // ✅ Marcar mensajes como leídos
        socket.on("markAsRead", function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!currentUserEmail)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, messages_1.Message.updateMany({
                                chatID: data.chatID,
                                readBy: { $ne: currentUserEmail } // ✅ Solo si no está ya marcado
                            }, {
                                $addToSet: { readBy: currentUserEmail } // ✅ Evitar duplicados
                            })];
                    case 2:
                        _a.sent();
                        // Notificar a otros participantes
                        socket.to(data.chatID).emit("messagesRead", {
                            chatID: data.chatID,
                            readBy: currentUserEmail
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error("❌ Error marking as read:", error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        socket.on("loadChatMessages", function (chatID) { return __awaiter(void 0, void 0, void 0, function () {
            var messages, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!currentUserEmail) {
                            socket.emit("error", "User not authenticated");
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, recoverMessages_1.recoverChatMessages)(chatID, currentUserEmail)];
                    case 2:
                        messages = _a.sent();
                        if (messages.length > 0) {
                            socket.emit("chatMessages", messages);
                        }
                        else {
                            socket.emit("chatMessages", []);
                        }
                        console.log("\uD83D\uDCCB Loaded ".concat(messages.length, " messages for chat: ").concat(chatID));
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error("❌ Error loading chat messages:", error_4);
                        socket.emit("error", "Failed to load chat messages");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // ✅ Manejo de desconexión
        socket.on("disconnect", function () {
            console.log("🔌 User disconnected:", socket.id);
            if (currentUserEmail) {
                // Marcar usuario como offline
                (0, userOnline_1.setUserOffline)(currentUserEmail);
                // Emitir lista actualizada de usuarios online a todos los clientes
                io.emit("onlineUsers", (0, userOnline_1.getOnlineUsers)());
                console.log("\u274C User ".concat(currentUserEmail, " set offline"));
            }
        });
        return [2 /*return*/];
    });
}); });
// Iniciar servidor
var PORT = process.env.PORT || 4000; // Puerto diferente al frontend
var HOST = process.env.HOST || '0.0.0.0';
httpServer.listen(PORT, function () {
    console.log("\uD83D\uDE80 Socket.io server running on http://".concat(HOST, ":").concat(PORT));
    console.log("\uD83D\uDCE1 WebSocket endpoint: ws://".concat(HOST, ":").concat(PORT, "/socket.io/"));
});
