"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Lobby() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    const keycloakLogoutUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL}?post_logout_redirect_uri=${process.env.NEXT_PUBLIC_KEYCLOAK_POST_LOGOUT_REDIRECT}&client_id=${process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID}`;
    window.location.href = keycloakLogoutUrl;
  };
  const hasLobbyRole =
  session?.roles?.includes("lobby") 

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
  if (!hasLobbyRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 p-4 text-center">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
          <p className="text-lg text-red-700 mb-4">Access Denied</p>
          <p className="text-gray-600">You do not have the <strong>lobby</strong> role.</p>
          <Link
            href="/dashboard"
            className="inline-block mt-4 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Welcome, {session.user?.name}
          </h1>
          <button
            onClick={handleLogout}
            className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>

        <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 p-4 text-center">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
          <p className="text-lg text-green-700 mb-4">Page Accessed </p>
          <p className="text-gray-600">You have the <strong>lobby</strong> role.</p>
          <Link
            href="/dashboard"
            className="inline-block mt-4 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
          >
            Go Back
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
