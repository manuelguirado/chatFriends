import { getFriends} from "@/lib/utils/getFriends";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const friends = await getFriends(email);

    return NextResponse.json({ friends }, { status: 200 });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json({ error: "Error fetching friends" }, { status: 500 });
  }
}