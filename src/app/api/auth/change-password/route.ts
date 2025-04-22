import { NextRequest, NextResponse } from "next/server";
import { updateUserPassword } from "@/lib/keycloakService"; // The function to update password

export async function POST(req: NextRequest) {
  try {
    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword) {
      throw new Error("User ID and new password are required");
    }

    // Update the password in Keycloak
    await updateUserPassword(userId, newPassword);

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
