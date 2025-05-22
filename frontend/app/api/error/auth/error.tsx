"use client"

import React, { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: Record<string, string> = {
    default: "Se produjo un error al intentar autenticarte",
    configuration: "Hay un problema con la configuración del servidor", 
    accessdenied: "No tienes permiso para acceder a este recurso",
    verification: "El enlace de verificación expiró o ya fue utilizado",
    callback: "Error en la URL de redirección del proveedor"
  }
  
  const errorMessage = errorMessages[error?.toLowerCase() || ""] || errorMessages.default

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Error de autenticación</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-6">{errorMessage}</p>
          <Link href="/login">
            <Button className="w-full">Volver a iniciar sesión</Button>
          </Link>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          Si el problema persiste, contacta con soporte.
        </CardFooter>
      </Card>
    </div>
  )
}