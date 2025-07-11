import { NextRequest, NextResponse } from "next/server";
import { handleUserByEmail } from "@/lib/utils/handleUser";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;
  console.log("POST /api/user - Received email:", email);

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const userResponse = await handleUserByEmail(email);
  console.log("POST /api/user - User response:", userResponse);

  if (userResponse.error) {
    return NextResponse.json({ error: userResponse.error }, { status: 404 });
  }

  return NextResponse.json(userResponse);
}
