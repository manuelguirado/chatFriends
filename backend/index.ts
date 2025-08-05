import { setUserOnline, setUserOffline, getOnlineUsers } from './utils/userOnline';
import { connectDatabase } from './connectDatabase';
import { Message } from "./models/messages";
import { generateChatID, getParticipants } from './utils/chatUtils';
import {
  updateReadby,
 
} from "./utils/utils";
 import { recoverChatMessages } from './utils/recoverMessages';
 import { saveMessageTolocalStorage } from './utils/saveToLocalStorage';
 import { saveMessageInDB } from './utils/saveMessageInDB';
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Configurar Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "https://chat-friends-alpha.vercel.app", // Tu frontend
    methods: ["GET", "POST"],
  },
});

// Conectar base de datos
connectDatabase()
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((error) => {
    console.error("❌ Error connecting to the database:", error);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("👋 Welcome to the Chat Server!") ;
});


// Socket.io eventos
io.on("connection", async (socket) => {
  console.log("🔌 A user connected:", socket.id);
  
  let currentUserEmail: string | null = null;

  // ✅ Autenticación del usuario
  socket.on("authenticate", (userEmail: string) => {
    console.log("🔐 Authenticating user:", userEmail);
    if (!userEmail || typeof userEmail !== 'string') {
      console.log("❌ Invalid userEmail:", userEmail);
      socket.emit("error", "Invalid user email");
      return;
    }
    
    
    currentUserEmail = userEmail;
    console.log("✅ User authenticated:", userEmail);
    
    // Marcar usuario como online
    setUserOnline(userEmail);
    
    // Emitir lista actualizada de usuarios online a todos los clientes
    io.emit("onlineUsers", getOnlineUsers());
    
    // Confirmar autenticación al frontend
    socket.emit("authenticated", { userEmail });
  });

  // ✅ Unirse a un chat específico
  socket.on("joinChat", async (contactEmail: string) => {
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
      const chatID = generateChatID(currentUserEmail, contactEmail);
      const participants = getParticipants(currentUserEmail, contactEmail);
      
      // Unirse a la sala del chat
      socket.join(chatID)
      console.log(`👥 User ${currentUserEmail} joined chat: ${chatID}`);
      
      // Cargar mensajes históricos
      const messages = await Message.find({ chatID })
        .sort({ timestamp: 1 })
        .limit(50) // ✅ Limitar para performance
        .lean(); // ✅ Mejor performance

      console.log(`📋 Loaded ${messages.length} messages for chat: ${chatID}`);
      if (messages.length > 0) {
        // ✅ Enviar mensajes al cliente
        socket.emit("chatMessages", messages);
      }else{
        socket.emit("chatMessages", []);
      }
      socket.emit("chatJoined", { chatID, participants });
      
    } catch (error) {
      console.error("❌ Error joining chat:", error);
      socket.emit("error", "Failed to join chat");
    }
  });

  // ✅ Enviar mensaje optimizado
  socket.on("sendMessage", async (data: { contactEmail: string; content: string }) => {
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
      const chatID = generateChatID(currentUserEmail, data.contactEmail);
      const participants = getParticipants(currentUserEmail, data.contactEmail);
      
      const message = new Message({
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
      
    } catch (error) {
      console.error("❌ Error sending message:", error);
      socket.emit("error", "Failed to send message");
    }
  });

  // ✅ Marcar mensajes como leídos
  socket.on("markAsRead", async (data: { chatID: string }) => {
    if (!currentUserEmail) return;

    try {
      await Message.updateMany(
        { 
          chatID: data.chatID,
          readBy: { $ne: currentUserEmail } // ✅ Solo si no está ya marcado
        },
        { 
          $addToSet: { readBy: currentUserEmail } // ✅ Evitar duplicados
        }
      );
      
      // Notificar a otros participantes
      socket.to(data.chatID).emit("messagesRead", {
        chatID: data.chatID,
        readBy: currentUserEmail
      });
      
    } catch (error) {
      console.error("❌ Error marking as read:", error);
    }
  });
  socket.on("loadChatMessages", async (chatID: string) => {
    if (!currentUserEmail) {
      socket.emit("error", "User not authenticated");
      return;
    }
    try{
      const messages = await recoverChatMessages(chatID, currentUserEmail);
      if (messages.length > 0) {
        socket.emit("chatMessages", messages);
      } else {
        socket.emit("chatMessages", []);
      }
      console.log(`📋 Loaded ${messages.length} messages for chat: ${chatID}`);

    }catch (error) {
      console.error("❌ Error loading chat messages:", error);
      socket.emit("error", "Failed to load chat messages");
    }
  });

  // ✅ Manejo de desconexión
  socket.on("disconnect", () => {
    console.log("🔌 User disconnected:", socket.id);
    if (currentUserEmail) {
      // Marcar usuario como offline
      setUserOffline(currentUserEmail);
      
      // Emitir lista actualizada de usuarios online a todos los clientes
      io.emit("onlineUsers", getOnlineUsers());
      
      console.log(`❌ User ${currentUserEmail} set offline`);
    }
  });
});

// Iniciar servidor
const PORT =  process.env.PORT || 4000; // Puerto diferente al frontend
const HOST = process.env.HOST || '0.0.0.0';

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.io server running on http://${HOST}:${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://${HOST}:${PORT}/socket.io/`);
});
