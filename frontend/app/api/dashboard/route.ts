import { getFriends } from "@/lib/utils/getFriends";
import { updateUserStatus } from "@/lib/utils/updateUserStatus";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated or user ID missing" }, { status: 401 });
    }

    const email = session.user.email;
    const userId = session.user.id;

    const friends = await getFriends(email);
    if (!friends) {
      return NextResponse.json({ error: "No friends found" }, { status: 404 });
    }

    try {
      await updateUserStatus(userId, true);
    } catch (err) {
      console.error("❌ Error setting user online:", err);
      // Continuar y devolver los amigos aunque falle el update de estado
    }

    return NextResponse.json({ friends }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching friends:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
