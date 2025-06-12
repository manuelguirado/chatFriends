"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"

import { use } from "passport"
import socket from "../api/socket/socket"



interface Message {
  id: string
  content: string
  sender: "user" | "contact"
  timestamp: Date
}

export default function ChatPage() {
 
 
const [messages, setMessages] = useState<Message[]>([])
const [newMessage, setNewMessage] = useState("")
const messagesEndRef = useRef<HTMLDivElement | null>(null)

useEffect(() => {
  socket.on("message", (message: Message) => {
    setMessages((prev) => [...prev, message])
  })

  return () => {
    socket.off("message")
  }
}, [])

function handleSendMessage(e: React.FormEvent) {
  e.preventDefault()
  if (newMessage.trim() === "") return
  socket.emit("message", newMessage)
  setNewMessage("")
}
 

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b p-4 flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Contact" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">Ana García</h2>
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
