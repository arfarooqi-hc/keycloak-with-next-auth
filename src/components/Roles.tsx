"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Roles() {
  const { data: session } = useSession();
  const [newRole, setNewRole] = useState(""); 

  // ROLES
  const createRole = async () => {
    if (!newRole.trim()) return alert("Please enter a role name.");

    try {
      const res = await fetch("/api/roles/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleName: newRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      console.log("Role created:", data.message);
      alert(`Role "${newRole}" created successfully`);
      setNewRole(""); // Clear input
    } catch (err) {
      console.error("Failed to create role:", err);
      alert("Failed to create role");
    }
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
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
      <h3 className="text-xl font-semibold mb-3">Add New Role</h3>
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Role name (e.g. camera.lobby.cam1.view)"
          className="border rounded px-3 py-1"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        />
        <button
          onClick={createRole}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Add Role
        </button>
      </div>
    </div>
  );
}
