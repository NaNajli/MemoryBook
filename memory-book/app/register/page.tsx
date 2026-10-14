"use client";

import React, { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!data) {
        throw new Error(`The authentication endpoint returned an unexpected response (HTTP ${response.status}). Check that the latest server routes are deployed.`);
      }

      if (response.ok) {
        setMessage(
          "Account created successfully. Redirecting to login..."
        );

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setMessage(data.error || "Registration failed");
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
          Create an Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border rounded p-3 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          Register
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