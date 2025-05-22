import { NextResponse } from "next/server";
import { createUserInDb } from "@/lib/db/services/createUserInDb";
import { findUserByEmail } from "@/lib/db/services/validateLogin";
export async function POST(request: Request) {
  const { name, email, password, oauthId, oauthProvider } = await request.json();
  console.log("Received data:", { name, email, password, oauthId, oauthProvider });

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 409 });
  }

  try {
    const newUser = await createUserInDb({ name, email, password, oauthId, oauthProvider });
    return NextResponse.json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      password: password,
      oauthId: oauthId,
      oauthProvider: oauthProvider,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
