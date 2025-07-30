"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode,useCallback} from 'react';
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
  isAuthenticated: boolean;
  messages: Message[];
  onlineUsers: string[];
  currentChatID: string | null;
  joinChat: (contactEmail: string) => void;
  sendMessage: (content: string, contactEmail: string) => void;
  leaveChat: () => void;
  isUserOnline: (email: string) => boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [currentChatID, setCurrentChatID] = useState<string | null>(null);
  const email = session?.user?.email || '';

  useEffect(() => {
    if (!session?.user?.email) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setIsAuthenticated(false);
      }
      return;
    }

    // Si ya hay un socket, no crear otro
    if (socket) return;

    console.log("🔌 Inicializando Socket.io...");
    
    const newSocket = io("http://localhost:4000", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Event handlers
    const handleConnect = () => {
      console.log("✅ Socket conectado:", newSocket.id);
      setIsConnected(true);
      newSocket.emit("authenticate", session.user!.email);
    };

    const handleAuthenticated = () => {
      console.log("✅ Usuario autenticado");
      setIsAuthenticated(true);
    };

    const handleOnlineUsers = (users: string[]) => {
      console.log("👥 Usuarios online:", users);
      setOnlineUsers(users);
    };

    const handleChatJoined = (data: any) => {
      console.log("👥 Chat joined:", data);
      setCurrentChatID(data.chatID);
    };

    const handleChatMessages = (chatMessages: Message[]) => {
      console.log("📋 Mensajes cargados:", chatMessages);
      setMessages(chatMessages);
    };

    const handleNewMessage = (message: Message) => {
      console.log("📨 Nuevo mensaje:", message);
      setMessages(prev => [...prev, message]);
    };

    const handleDisconnect = () => {
      console.log("❌ Socket desconectado");
      setIsConnected(false);
      setIsAuthenticated(false);
      setOnlineUsers([]); // Limpiar usuarios online al desconectarse
    };

    // Registrar listeners
    newSocket.on("connect", handleConnect);
    newSocket.on("authenticated", handleAuthenticated);
    newSocket.on("onlineUsers", handleOnlineUsers);
    newSocket.on("chatJoined", handleChatJoined);
    newSocket.on("chatMessages", handleChatMessages);
    newSocket.on("newMessage", handleNewMessage);
    newSocket.on("disconnect", handleDisconnect);

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [session?.user?.email]);


  const joinChat = useCallback((contactEmail: string) => {
  if (!socket || !isConnected) {
    console.log("❌ Socket no conectado");
    setIsConnected(false);
    setIsAuthenticated(false);
    return;
  }

  if (!isAuthenticated) {
    console.log("❌ Usuario no autenticado");
    return;
  }

  console.log("🔄 Joining chat with:", contactEmail);
  socket.emit('joinChat', contactEmail);
}, [socket, isConnected, isAuthenticated]);

const sendMessage = useCallback((content: string, contactEmail: string) => {
  if (!socket || !isConnected) {
    console.log("❌ Socket no conectado para enviar mensaje");
    return;
  }

  if (!isAuthenticated) {
    console.log("❌ Usuario no autenticado para enviar mensaje");
    return;
  }

  console.log("📤 Sending message:", { content, contactEmail });
  socket.emit('sendMessage', { content, contactEmail });
}, [socket, isConnected, isAuthenticated]);

const leaveChat = useCallback(() => {
  if (socket && isConnected && currentChatID) {
    socket.emit('leaveChat', { chatID: currentChatID });
    setCurrentChatID(null);
    setMessages([]);
  }
}, [socket, isConnected, currentChatID]);

const isUserOnline = useCallback((email: string): boolean => {
  return onlineUsers.includes(email);
}, [onlineUsers]);

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      isAuthenticated,
      messages,
      onlineUsers,
      currentChatID,
      joinChat,
      sendMessage,
      leaveChat,
      isUserOnline
    }}>
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
