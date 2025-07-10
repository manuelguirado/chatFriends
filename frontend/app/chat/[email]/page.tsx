"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import socket from "@/app/api/socket/socket"
import { useParams } from 'next/navigation'

interface Message {
  id: string
  content: string
  sender: "user" | "contact"
  timestamp: Date
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [username, setUsername] = useState("")
  const [profilePicture, setProfilePicture] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const params = useParams()
  const email = params.email as string
  console.log("ChatPage renderizado, session:", session, "status:", status)

// Obtener datos del usuario
useEffect(() => {
  const checkSession = async () => {
    const res = await fetch("/api/auth/session");
    const data = await res.json();
    console.log("🔍 /api/auth/session:", data);
  };

  checkSession();
}, []);

useEffect(() => {
  console.log("useEffect: status=", status, "email=", session?.user?.email);
  if (!session && status === "unauthenticated") {
    console.log("No hay sesión activa, redirigiendo a /login");
    window.location.href = "/login";
    return;
  }
  if (status === "authenticated" && session?.user?.email) {
    const fetchUserData = async () => {
      console.log("fetchUserData ejecutado");
      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: session.user?.email }),
        });
        console.log("fetch respuesta", res);

        if (res.status === 400) {
          console.error("Error 400: Bad request");
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          console.error("Error:", data.error);
          return;
        }

        setUsername(data.username);
        if (data.profilePicture) {
          setProfilePicture(data.profilePicture);
        }
      } catch (err) {
        console.error("Error al hacer fetch:", err);
      }
    };

    fetchUserData();
  }
}, [session, status]);


  // Socket.io conexión y mensajes
  useEffect(() => {
    console.log("🔌 Configurando Socket.io...");
    
    // Eventos de conexión
    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket desconectado");
      setIsConnected(false);
    });

    // Escuchar mensajes
    socket.on("message", (message: Message) => {
      console.log("📨 Mensaje recibido:", message);
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    // Cargar mensajes históricos
    socket.on("loadMessagesResponse", (loadedMessages: Message[]) => {
      console.log("📋 Mensajes cargados:", loadedMessages);
      setMessages(loadedMessages);
      scrollToBottom();
    });

    // Cargar mensajes al conectar
    if (email) {
      socket.emit("loadMessages", email);
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
      socket.off("loadMessagesResponse");
    };
  }, [email]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "" || !isConnected) return
    
    console.log("📤 Enviando mensaje:", newMessage);
    
    // Crear mensaje local
    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    }
    
    // Añadir mensaje localmente
    setMessages((prev) => [...prev, newMsg])
    
    // Enviar por socket
    socket.emit("message", newMessage)
    
    setNewMessage("")
    scrollToBottom()
  }
  
  // Función para cargar mensajes manualmente (si es necesario)
  const handleLoadMessages = () => {
    if (isConnected) {
      socket.emit("loadMessages", email)
    }
  }
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b p-4 flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={profilePicture || "/placeholder.svg"} alt="Profile" />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold">{decodeURIComponent(email)}</h2>
          <p className="text-xs text-gray-500">
            {isConnected ? "🟢 En línea" : "🔴 Desconectado"}
          </p>
        </div>
        {/* Botón debug para recargar mensajes */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLoadMessages}
          disabled={!isConnected}
          className="ml-2"
        >
          🔄
        </Button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="space-y-4">
          {/* Estado de conexión */}
          {!isConnected && (
            <div className="flex justify-center">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg text-sm">
                🔄 Conectando al servidor...
              </div>
            </div>
          )}
          
          {/* Mensajes */}
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-emerald-500 text-white"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${message.sender === "user" ? "text-emerald-100" : "text-gray-500"}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t p-4 flex items-center gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={isConnected ? "Escribe un mensaje..." : "Conectando..."}
          className="flex-1"
          disabled={!isConnected}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="rounded-full bg-emerald-500 hover:bg-emerald-600"
          disabled={!isConnected}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Enviar mensaje</span>
        </Button>
      </form>
    </div>
  )
}
