import Link from "next/link"
import { Button } from "@/components/ui/button"
import {  MessageCircle } from "lucide-react"

export default function dashboard() {
    return (
     <div className="flex flex-col min-h-screen">
            {/* Navigation */}
        <header className="border-b w-full">
            <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
                <div className="flex items-center gap-2">
                    <MessageCircle className="h-6 w-6 text-emerald-500" />
                    <span className="text-xl font-bold">ChatFriends</span>
                </div>
               <div className="flex items-center gap-4">
                    <Link href="/addFriends">
                        <Button className="bg-transparent hover:bg-gray-100 text-gray-700">Añadir amigo</Button>
                    </Link>
               </div>
            </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* User Chat Component */}
                <p className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    Aun no tienes amigos agregados.
                </p>
            </div>
        </main>
     </div>

          
    )
}