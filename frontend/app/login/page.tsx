"use client"
import { useSession, signIn } from "next-auth/react"
import { useEffect } from "react"

import { checkUserCredentials } from "@/lib/db/services/validateLogin"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"



export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // Aquí iría la lógica de autenticación
     getCredentials(e)
  

    setTimeout(() => setIsLoading(false), 1000)
  }
 const getCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault()
 
        const emailInput = document.getElementById("email") as HTMLInputElement
        const passwordInput = document.getElementById("password") as HTMLInputElement
        const user = { email: emailInput.value, password: passwordInput.value }
        console.log(user)
        fetch("/api/login", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })
          .then(async (res) => {
            if (res.ok) {
              const data = await res.json()
              console.log("Usuario encontrado", data)
               checkUserCredentials(user.email, user.password)
            } else if (res.status === 404) {
              console.log("El usuario no existe en la base de datos")
            } else {
              const data = await res.json()
              console.error("Error al iniciar sesión:", data.message)
            }
          })
          .catch((err) => {
            console.error("Error de red al iniciar sesión:", err)
          })
       
        const isValid = checkUserCredentials(user.email, user.password)
         if ( await isValid){
            console.log("Usuario válido")
            // Aquí puedes redirigir al usuario a la página de chat
            window.location.href = "/"          
         }else{
             window.location.href = "/login"
             console.log("Usuario no válido")
         }
      
 }
  const handleGoogleSignIn = () => {
    setIsLoading(true)
 
    signIn("google", { 
      callbackUrl: "/", // Cambia esto a la URL de tu aplicación
      redirect: false // Explicitly set redirect to true
    }).catch(error => {
      console.error("Error:", error)
  
    })
     setIsLoading(false)
  }

  const { data: session } = useSession()

useEffect(() => {
  if (session) {
    const user = {
      name: session.user?.name || "Google User",
      email: session.user?.email || "sincorreo@google.com",
      password: "google",
    
    }
   fetch("api/login", {
    method : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user)
   })
   .then(async (res) => {
    if (res.status === 200) {
      console.log("Usuario encontrado")
    } else if (res.status === 404) {
      console.log("Usuario no encontrado")
    }
   })
   .catch((err) => {
      console.error("Error de red al buscar usuario:", err)
   });

    checkUserCredentials(user.email, user.password)

    console.log("Usuario de Google guardado")
  }
}, [session])


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <MessageCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="tu@ejemplo.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">O continúa con</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Iniciar sesión con Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
