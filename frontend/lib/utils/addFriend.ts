import { handleUserByEmail } from "@/lib/utils/handleUser";
import { connectDatabase } from "@/connectDatabase";
import { getFriends } from "@/lib/utils/getFriends";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function addFriend(email: string) {
  try {
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDatabase();

    // Usuario que se va a agregar
    const userToAdd = await handleUserByEmail(email);
    if (!userToAdd || "error" in userToAdd) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Obtener sesión
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email;

    if (!currentUserEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const currentUser = await getFriends(currentUserEmail);

    if (!currentUser) {
      return NextResponse.json({ error: "Current user not found" }, { status: 404 });
    }

    // Verificar si ya es amigo
    if (
      currentUser.friends.some(
        (friend: { email: string }) => friend.email === userToAdd.email
      )
    ) {
      return NextResponse.json({ error: "User is already a friend" }, { status: 400 });
    }

    // Añadir amigo
    currentUser.friends.push({ email: userToAdd.email });
    await currentUser.save();

    return NextResponse.json({ message: "Friend added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding friend:", error);
    return NextResponse.json({ error: "Error adding friend" }, { status: 500 });
  }
}
