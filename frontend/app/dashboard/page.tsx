"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, UserCheck, UserX } from "lucide-react"
import { useEffect, useState } from "react"
import { useSocket } from "@/contexts/SocketContext"

type Friend = {
  email: string;
  status?: string;
};

export default function Dashboard() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { isUserOnline, isConnected, isAuthenticated } = useSocket();
  

    useEffect(() => {
        fetch('/api/dashboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Friends data:', data);
            setFriends(data.friends?.friends || []);
            setLoading(false);
        })
        .catch((error: Error) => {
            console.error('Error fetching friends:', error);
            setError(error.message);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Cargando amigos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-red-500">Error: {error}</div>
            </div>
        );
    }

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
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                            isConnected && isAuthenticated 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {isConnected && isAuthenticated ? (
                                <>
                                    <UserCheck className="h-4 w-4" />
                                    Conectado
                                </>
                            ) : (
                                <>
                                    <UserX className="h-4 w-4" />
                                    Desconectado
                                </>
                            )}
                        </div>
                        <Link href="/addFriends">
                            <Button className="bg-gradient-to-r from-emerald-50 to-emerald-100 hover:bg-gray-100 text-gray-700">
                                Añadir amigo
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>
            
            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Tus Amigos</h1>
                    
                    {friends.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">No tienes amigos agregados todavía.</p>
                            <Link href="/addFriends">
                                <Button>Agregar Amigos</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {friends.map((friend, index) => {
                                const isOnline = isUserOnline(friend.email);
                                return (
                                    <div key={friend.email || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                    {friend.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{friend.email}</h3>
                                                    <div className={`flex items-center gap-1 text-sm ${
                                                        isOnline ? 'text-green-600' : 'text-gray-500'
                                                    }`}>
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            isOnline ? 'bg-green-500' : 'bg-gray-400'
                                                        }`} />
                                                        {isOnline ? 'En línea' : 'Desconectado'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Link href={`/chat/${encodeURIComponent(friend.email)}`}>
                                            <Button variant="outline" className="w-full">
                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                Chatear
                                            </Button>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}