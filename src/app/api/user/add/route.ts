import { createUser } from "@/lib/keycloakService";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    await createUser(userData);
    revalidateTag("users");

    return NextResponse.json({ success: true, message: "User created successfully" });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to create user" }, { status: 500 });
  }
}
