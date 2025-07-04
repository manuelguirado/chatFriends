import { handleUserByEmail } from "@/lib/utils/handleUser";
import { connectDatabase } from "@/connectDatabase";
import { getFriends } from "@/lib/utils/getFriends";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BaseUser } from "../db/models/user";

async function updateUserFriends(
  userToAddEmail: string,
  currentUserEmail: string
): Promise<void> {
  await connectDatabase();

  const userToAdd = await BaseUser.findOne({ email: userToAddEmail });
  if (!userToAdd) throw new Error("User to add not found");

  const currentUser = await BaseUser.findOne({ email: currentUserEmail });
  if (!currentUser) throw new Error("Current user not found");



  currentUser.friends.push(userToAdd._id);
  userToAdd.friends.push(currentUser._id);

  await currentUser.save();
  await userToAdd.save();
}

export default async function addFriend(email: string) {
  try {
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDatabase();

    // Usuario que se va a agregar
    const userToAdd = await handleUserByEmail(email);
    console.log("User to add:", userToAdd);
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
    // Verificar si el usuario ya es amigo
    const alreadyFriends =
      currentUser.friends.some((friend: { email: string }) => friend.email === userToAdd.email);
    if (alreadyFriends) {
      return NextResponse.json({ error: "Already friends" }, { status: 400 });
    }
    
    // The updateUserFriends function now handles both adding and saving friends
    await updateUserFriends(userToAdd.email, currentUserEmail);
    
    return NextResponse.json({ success: true, user: userToAdd }, { status: 200 });
  } catch (error) {
    console.error("Error adding friend:", error);
    return NextResponse.json({ error: "Error adding friend" }, { status: 500 });
  }
}
