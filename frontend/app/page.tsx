import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">ChatReal</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1">
        <div className="container flex flex-col items-center justify-center py-20 text-center md:py-32">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Comunicación en tiempo real
            <span className="text-emerald-500"> simplificada</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            ChatReal te permite conectar con tus amigos y familiares de forma instantánea. Mensajería rápida, segura y
            fácil de usar, todo en una sola aplicación.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Comenzar ahora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                Ver demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="container py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl mb-12">
            Características principales
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
                <MessageCircle className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold">Mensajería instantánea</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Envía y recibe mensajes en tiempo real sin retrasos ni interrupciones.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
                <svg
                  className="h-6 w-6 text-emerald-500"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 16h5v5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Sincronización perfecta</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Accede a tus conversaciones desde cualquier dispositivo sin perder ningún mensaje.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
                <svg
                  className="h-6 w-6 text-emerald-500"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Seguridad garantizada</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Tus conversaciones están protegidas con la más alta tecnología de encriptación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">© 2025 ChatReal. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
