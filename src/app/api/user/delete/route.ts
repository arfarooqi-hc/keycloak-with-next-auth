import { deleteUser } from "@/lib/keycloakService";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    await deleteUser(userId);

    revalidateTag("users");
    return NextResponse.json({ success: true, message: `User ${userId} deleted successfully` });
  } catch (err) {
    console.error("Error deleting user from Keycloak:", err);
    return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 });
  }
}