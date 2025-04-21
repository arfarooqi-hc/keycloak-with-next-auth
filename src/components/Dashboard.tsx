"use client";

import {
  createUser,
  deleteUser,
  updateUserById,
} from "@/lib/keycloakService";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Roles from "./Roles";

export default function Dashboard() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "" });
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editUserData, setEditUserData] = useState({ email: "", enabled: true });

  const handleLogout = async () => {
    await signOut({ redirect: false });
    const keycloakLogoutUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL}?post_logout_redirect_uri=${process.env.NEXT_PUBLIC_KEYCLOAK_POST_LOGOUT_REDIRECT}&client_id=${process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID}`;
    window.location.href = keycloakLogoutUrl;
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/user/get", {
        method: "POST", // Change to POST
        headers: {
          "Content-Type": "application/json", // Set the appropriate content type
        },
        // If you need to pass any data in the request body, you can add it here.
        body: JSON.stringify({}) // Empty object or any data you want to send in the body
      });

      const result = await res.json();

      setUsers(result.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      await createUser({
        username: newUser.username,
        email: newUser.email,
        enabled: true,
        credentials: [
          {
            type: "password",
            value: newUser.password,
            temporary: false,
          },
        ],
      });
      setNewUser({ username: "", email: "", password: "" });
      fetchUsers();
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  const handleUpdateUser = async (id: string) => {
    try {
      await updateUserById(id, editUserData);
      setEditMode(null);
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
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
        <Roles />
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-semibold mb-3">Add New User</h3>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Username"
              className="border rounded px-3 py-1"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border rounded px-3 py-1"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded px-3 py-1"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <button
              onClick={handleAddUser}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-semibold mb-3">Protected Pages</h3>
          <div className="flex flex-wrap gap-2">
          <Link
            href="/lobby"
            className="inline-block mt-4 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
          >
            Go to Lobby Page
          </Link>
          <Link
            href="/entrance"
            className="inline-block mt-4 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
          >
            Go to Entrance Page
          </Link>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">User List</h2>
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Email Verified</th>
                <th className="px-4 py-2">Admin</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">
                    {editMode === user.id ? (
                      <input
                        type="email"
                        className="border px-2 py-1 w-full"
                        value={editUserData.email}
                        onChange={(e) =>
                          setEditUserData({ ...editUserData, email: e.target.value })
                        }
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {user.emailVerified ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2">
                    {user.attributes?.is_temporary_admin?.[0] === "true" ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2">
                    {user.roles.realmRoles.map((role: any,idx:any) => (
                      <span key={role.name} className="block">
                        {idx+1}: {role.name}
                      </span>
                    ))}
                  </td>

                  <td className="px-4 py-2 space-x-2">
                    {editMode === user.id ? (
                      <>
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded"
                          onClick={() => handleUpdateUser(user.id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-400 text-white px-2 py-1 rounded"
                          onClick={() => setEditMode(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          onClick={() => {
                            setEditMode(user.id);
                            setEditUserData({ email: user.email, enabled: user.enabled });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
