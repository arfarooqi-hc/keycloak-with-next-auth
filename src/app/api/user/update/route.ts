import { updateUser } from "@/lib/keycloakService";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const { userId, userData } = await request.json();
    if (!userId || !userData) {
      return NextResponse.json({ success: false, message: "Missing userId or userData" }, { status: 400 });
    }

    await updateUser(userId, userData);
    revalidateTag("users");

    return NextResponse.json({ success: true, message: `User ${userId} updated successfully` });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to update user" }, { status: 500 });
  }
}