import { getFriends } from "@/lib/utils/getFriends";
import { setUserOnline } from "@/lib/utils/userOnline";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Obtener la sesión del servidor
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const email = session.user.email;
    const friends = await getFriends(email);
    const userId = session.user.id;
    if (!friends) {
      return NextResponse.json({ error: "No friends found" }, { status: 404 });
    }
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }
    // Marcar al usuario como online
    await setUserOnline(userId).then(() => {
       NextResponse.json({ message: "User is online" }, { status: 200 })
       }).catch((error) => {
       console.error("Error setting user online:", error)   
       return NextResponse.json({ error: "Error setting user online" }, { status: 500 });
    });

    return NextResponse.json({ friends }, { status: 200 });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json({ error: "Error fetching friends" }, { status: 500 });
  }
}