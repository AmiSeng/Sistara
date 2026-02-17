"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "../src/components/layout/Footer";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // ✅ Unified storage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("role", data.role);

      // ✅ Smart redirection
      if (data.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (data.role === "STUDENT") {
        router.push("/student/dashboard");
      } else {
        setError("Unauthorized role.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-[#0B0E48] via-[#05073f] to-[#0B0E48] animate-gradient-x p-4">
      <header className="flex justify-center items-center py-8">
        <Image
          src="/mylogocp.png"
          alt="Sistara EdTech"
          width={200}
          height={80}
          className="object-contain"
        />
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] w-full max-w-md p-12 flex flex-col gap-6 transition-transform duration-500 hover:scale-[1.03] hover:shadow-[0_30px_90px_rgba(11,14,72,0.5)]"
        >
          <h2 className="text-4xl font-extrabold text-[#0B0E48] text-center tracking-wide mb-6">
            Sistara Login
          </h2>

          {error && (
            <p className="text-red-500 font-medium text-center animate-pulse">
              {error}
            </p>
          )}

          <div className="w-full mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 text-lg text-[#0B0E48] placeholder-gray-400 border-2 border-gray-300 rounded-xl focus:border-[#0B0E48] focus:ring-4 focus:ring-[#0B0E48]/40 focus:outline-none transition-all duration-300 shadow-inner"
            />
          </div>

          <div className="w-full mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-lg text-[#0B0E48] placeholder-gray-400 border-2 border-gray-300 rounded-xl focus:border-[#0B0E48] focus:ring-4 focus:ring-[#0B0E48]/40 focus:outline-none transition-all duration-300 shadow-inner"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#0B0E48] to-[#05073f] text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:scale-105 hover:shadow-2xl hover:brightness-110 transition-all duration-300"
          >
            Login
          </button>

          <p className="text-center text-gray-600 mt-2 text-sm">
            Welcome back to Sistara
          </p>
        </form>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </div>
  );
}
