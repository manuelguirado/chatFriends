"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"

type Friend = {
  email: string;
  status?: string;
};

type FriendData = {
  friends: Array<{ friends: Friend[] }>;
};
function setOnline(friends: Friend[]): Friend[] {
  return friends.map(friend => ({
    ...friend,
    status: 'Activo' // Assuming all friends are online for this example
  }));
}

export default function Dashboard() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading friends...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">Error: {error}</p>
                    ) : friends.length === 0 ? (
                        <p className="text-center text-gray-600">
                            No tienes amigos. ¡Pincha en el botón añadir amigo para poder agregar a tus amigos!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                Tus Amigos ({friends.length})
                            </h3>
                            <div className="grid gap-3">
                                {friends.map((friend, index) => (
                                    <Link href={`/chat/${friend.email}`} key={index}>
                                    <div 
                                        key={index}
                                        className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold text-lg">
                                                    {friend.email.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                              <a href="/chat">
                                                <p className="text-gray-800 dark:text-gray-200 font-medium" >
                                                    {friend.email}
                                                </p>
                                                </a>
                                                <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                                                    {setOnline([friend])[0].status|| 'Activo'}
                                                </p>
                                            </div>
                                            <MessageCircle className="w-5 h-5 text-emerald-500" />
                                        </div>
                                    </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    </div>
    );
}