"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/student/login", {
        email,
        password,
      });

      localStorage.setItem("studentToken", res.data.token);

      router.push("/student/dashboard");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0E48]">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl w-96 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#0B0E48]">
          Student Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-[#0B0E48] text-white py-3 rounded-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
}
