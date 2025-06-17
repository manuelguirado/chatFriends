"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import socket from "../api/socket/socket"


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
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Obtener datos del usuario
 useEffect(() => {
  console.log("useEffect: status=", status, "email=", session?.user?.email);
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


  // Socket.io para recibir mensajes
  useEffect(() => {
    socket.on("message", (message: Message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socket.off("message")
    }
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "") return
    socket.emit("message", newMessage)
    setNewMessage("")
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
          <AvatarFallback>{username.slice(0, 2).toUpperCase() || "CN"}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{username}</h2>
          <p className="text-xs text-gray-500">En línea</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="space-y-4">
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
          placeholder="Escribe un mensaje..."
          className="flex-1"
        />
        <Button type="submit" size="icon" className="rounded-full bg-emerald-500 hover:bg-emerald-600">
          <Send className="h-4 w-4" />
          <span className="sr-only">Enviar mensaje</span>
        </Button>
      </form>
    </div>
  )
}
