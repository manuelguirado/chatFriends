import { connectDatabase } from './connectDatabase';
import { Message } from "./models/messages";
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
import { generateChatID, getParticipants } from './utils/chatUtils';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Configurar Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Tu frontend
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




// Socket.io eventos
io.on("connection", async (socket) => {
  console.log("🔌 A user connected:", socket.id);
  
  let currentUserEmail: string | null = null;

  // ✅ Autenticación del usuario
  socket.on("authenticate", (userEmail: string) => {
    currentUserEmail = userEmail;
    console.log("🔐 User authenticated:", userEmail);
  });

  // ✅ Unirse a un chat específico
  socket.on("joinChat", async (contactEmail: string) => {
    if (!currentUserEmail) {
      socket.emit("error", "User not authenticated");
      return;
    }

    try {
      const chatID = generateChatID(currentUserEmail, contactEmail);
      const participants = getParticipants(currentUserEmail, contactEmail);
      
      // Unirse a la sala del chat
      socket.join(chatID);
      console.log(`👥 User ${currentUserEmail} joined chat: ${chatID}`);
      
      // Cargar mensajes históricos
      const messages = await Message.find({ chatID })
        .sort({ timestamp: 1 })
        .limit(50) // ✅ Limitar para performance
        .lean(); // ✅ Mejor performance
      
      socket.emit("chatMessages", messages);
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

  // ✅ Manejo de desconexión
  socket.on("disconnect", () => {
    console.log("🔌 User disconnected:", socket.id);
    if (currentUserEmail) {
      // Opcional: Actualizar estado offline en base de datos
    }
  });
});

// Iniciar servidor
const PORT =  4000; // Puerto diferente al frontend
const HOST = process.env.HOST || 'localhost';

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.io server running on http://${HOST}:${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://${HOST}:${PORT}/socket.io/`);
});
