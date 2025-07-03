"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AddFriendsPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return alert("Por favor introduce un correo.");

    try {
      const res = await fetch("/api/addFriends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendEmail: email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Algo salió mal");

      alert("Amigo agregado con éxito 🎉");
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <MessageCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Añade amigos para empezar a chatear
          </CardTitle>
          <CardDescription>Ingresa el Gmail de tu amigo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@ejemplo.com"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Buscar amigo
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
