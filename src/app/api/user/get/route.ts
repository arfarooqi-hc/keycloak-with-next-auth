export const dynamic = "force-dynamic"; 

import { getUsers } from "@/lib/keycloakService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(
      { success: true, data: users, status: 200 },
      { headers: { "Cache-Tag": "users" } }
    );
  } catch (err) {
    console.error("Error fetching users from Keycloak:", err);
    return NextResponse.json("Failed to fetch users", {
      status: 500,
    });
  }
}
