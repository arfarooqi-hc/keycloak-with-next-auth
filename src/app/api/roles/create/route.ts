import { createRealmRole } from "@/lib/keycloakService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const roleName = body.roleName;
console.log("Creating role with name:", roleName); // Debugging line

    if (!roleName) {
      return NextResponse.json({ success: false, message: "Role name is required" }, { status: 400 });
    }

    await createRealmRole(roleName);

    return NextResponse.json({ success: true, message: "Role created successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to create role" }, { status: 500 });
  }
}
