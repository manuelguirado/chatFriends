"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  senderEmail: string;
  timestamp: Date;
  chatID: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  messages: Message[];
  currentChatID: string | null;
  joinChat: (contactEmail: string) => void;
  sendMessage: (content: string, contactEmail: string) => void;
  leaveChat: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatID, setCurrentChatID] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // ✅ Inicializar socket SOLO una vez cuando hay sesión
  useEffect(() => {
    // Prevenir múltiples inicializaciones
    if (!session?.user?.email || isInitialized || socket) {
      return;
    }

    console.log("🔌 Inicializando Socket.io ÚNICA VEZ...");
    setIsInitialized(true);
    
    const newSocket = io("http://localhost:4000", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 3, // ✅ Reducir intentos
      reconnectionDelay: 2000,  // ✅ Aumentar delay
      timeout: 5000,           // ✅ Timeout más corto
      forceNew: false,         // ✅ Reutilizar conexión
    });

    // ✅ Event listeners centralizados
    newSocket.on("connect", () => {
      console.log("✅ Socket conectado:", newSocket.id);
      setIsConnected(true);
      newSocket.emit("authenticate", session.user.email);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket desconectado. Razón:", reason);
      setIsConnected(false);
      
      // ✅ Solo reconectar en ciertos casos
      if (reason === "io server disconnect") {
        console.log("🔄 Servidor desconectó, reintentando...");
        newSocket.connect();
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Error de conexión:", error.message);
      setIsConnected(false);
    });

    newSocket.on("chatJoined", (data) => {
      console.log("👥 Chat joined:", data);
      setCurrentChatID(data.chatID);
    });

    newSocket.on("chatMessages", (chatMessages) => {
      console.log("📋 Mensajes cargados:", chatMessages);
      setMessages(chatMessages);
    });

    newSocket.on("newMessage", (message) => {
      console.log("📨 Nuevo mensaje:", message);
      setMessages(prev => [...prev, message]);
    });

    newSocket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    setSocket(newSocket);

    // ✅ Cleanup mejorado
    return () => {
      console.log("🧹 Limpiando socket...");
      newSocket.removeAllListeners();
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setIsInitialized(false);
    };
  }, [session?.user?.email, isInitialized, socket]);

  // ✅ Funciones del contexto con validaciones
  const joinChat = (contactEmail: string) => {
    if (!socket || !isConnected) {
      console.warn("⚠️ Socket no disponible para unirse al chat");
      return;
    }
    
    console.log("👥 Joining chat with:", contactEmail);
    socket.emit("joinChat", contactEmail);
    setMessages([]); // Limpiar mensajes anteriores
  };

  const sendMessage = (content: string, contactEmail: string) => {
    if (!socket || !isConnected) {
      console.warn("⚠️ Socket no disponible para enviar mensaje");
      return;
    }
    
    if (!content.trim()) {
      console.warn("⚠️ Mensaje vacío");
      return;
    }
    
    console.log("📤 Enviando mensaje:", content);
    socket.emit("sendMessage", {
      contactEmail,
      content
    });
  };

  const leaveChat = () => {
    setCurrentChatID(null);
    setMessages([]);
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    messages,
    currentChatID,
    joinChat,
    sendMessage,
    leaveChat,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

// ✅ Custom hook
export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
