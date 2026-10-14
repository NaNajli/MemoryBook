"use client";

import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);
      if (!data) {
        throw new Error(`The authentication endpoint returned an unexpected response (HTTP ${response.status}). Check that the latest server routes are deployed.`);
      }

      if (response.ok) {
        // The server validates the user and sets an HttpOnly session cookie.
        window.location.href = data.redirectTo;
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to connect to server");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Log In
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded p-3 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded p-3 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-700 text-white rounded p-3"
        >
          Log In
        </button>

        {message && (
          <p className="mt-4 text-center">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}