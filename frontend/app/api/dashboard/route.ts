import { getFriends } from "@/lib/utils/getFriends";
import { setUserOnline } from "@/lib/utils/userOnline";
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
      await setUserOnline(userId);
    } catch (err) {
      console.error("❌ Error setting user online:", err);
      return NextResponse.json({ error: "Error setting user online" }, { status: 500 });
    }

    return NextResponse.json({ friends }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching friends:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
