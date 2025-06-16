

import { checkUserCredentials } from "@/lib/db/services/validateLogin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  console.log("Received email:", email);
  console.log("Received password:", password);
  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }
  console.log("Checking user credentials for email:", email);

  const result = await checkUserCredentials(email, password);
  console.log("Login attempt for email:", email);
  console.log("Password provided:", password);
  console.log("Result from checkUserCredentials:", result);
  if (!result) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  console.log("Result:", result);

  if (!result.success) {
    return NextResponse.json({ message: result.message }, { status: 401 });
  }

  return NextResponse.json({ success : true ,  user: result.user }, { status: 200 });
}
