

import { checkUserCredentials } from "@/lib/db/services/validateLogin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const result = await checkUserCredentials(email, password);

  if (!result.success) {
    return NextResponse.json({ message: result.message }, { status: 401 });
  }

  return NextResponse.json({ user: result.user }, { status: 200 });
}
