import { loginWithCredentials } from "@/lib/keycloakService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const tokenData = await loginWithCredentials(username, password);

    return NextResponse.json(tokenData); // you can customize this to return just the access_token if you prefer
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
