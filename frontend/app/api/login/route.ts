

import { checkUserCredentials } from "@/lib/db/services/validateLogin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const result = await checkUserCredentials(email, password);
  if (!result) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  console.log("Result:", result);

  if (!result.success) {
    return NextResponse.json({ message: result.message }, { status: 401 });
  }

  return NextResponse.json({ success : true ,  user: result.user }, { status: 200 });
}
