"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ChangePassword = () => {
  const { data: session } = useSession();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  console.log("session on change password page", session);
  
  const handleChangePassword = async () => {
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Something went wrong!");
        return;
      }

      // Redirect after password change
      router.push("/dashboard");
    } catch (error) {
      setError("Failed to change password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Change Your Password</h2>
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={handleChangePassword}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Change Password
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default ChangePassword;
