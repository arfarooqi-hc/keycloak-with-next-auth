'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {

      await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

    } catch (error) {
      setError("Invalid username or password");
      console.log("Login error:", error);
    } finally {
      window.location.href = "/dashboard";

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition duration-200"
        >
          Sign In
        </button>

        {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
