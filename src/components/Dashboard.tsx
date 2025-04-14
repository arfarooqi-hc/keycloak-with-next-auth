"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    const keycloakLogoutUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL}?post_logout_redirect_uri=${process.env.NEXT_PUBLIC_KEYCLOAK_POST_LOGOUT_REDIRECT}&client_id=${process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID}`;
    window.location.href = keycloakLogoutUrl;
  };

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
          <p className="text-lg text-gray-700 mb-4">You are not signed in</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Welcome, {session.user?.name}
        </h1>
        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-medium">Email:</span> {session.user?.email}
          </p>
          <p className="break-all">
            <span className="font-medium">Access Token:</span> {session.accessToken}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
