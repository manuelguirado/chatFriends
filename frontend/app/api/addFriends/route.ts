import addFriend  from '@/lib/utils/addFriend';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { friendEmail } = await request.json();

    if (!friendEmail) {
      return NextResponse.json({ error: "friendEmail is required" }, { status: 400 });
    }

    const response = await addFriend(friendEmail);

    return response;
  } catch (error) {
    console.error("Error adding friend:", error);
    return NextResponse.json({ error: "Error adding friend" }, { status: 500 });
  }
}

