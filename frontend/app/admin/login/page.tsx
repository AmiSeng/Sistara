"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "../../src/components/layout/Footer";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // ✅ Store admin token for dashboard
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));
      // ✅ Redirect after storing token
      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-[#0B0E48] via-[#05073f] to-[#0B0E48] animate-gradient-x p-4">
      {/* Header: Centered Logo */}
      <header className="flex justify-center items-center py-8">
        <Image
          src="/mylogocp.png"
          alt="Sistara EdTech"
          width={200}
          height={80}
          className="object-contain"
        />
      </header>
      {/* Main: Login Form */}
      <main className="flex flex-1 items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] w-full max-w-md p-12 flex flex-col gap-6 transition-transform duration-500 hover:scale-[1.03] hover:shadow-[0_30px_90px_rgba(11,14,72,0.5)]"
        >
          <h2 className="text-4xl font-extrabold text-[#0B0E48] text-center tracking-wide mb-6">
            Admin Login
          </h2>

          {error && (
            <p className="text-red-500 font-medium text-center animate-pulse">
              {error}
            </p>
          )}

          {/* Username */}
          <div className="w-full mb-4 relative">
            <input
              type="text"
              placeholder="Username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 text-lg text-[#0B0E48] placeholder-gray-400 border-2 border-gray-300 rounded-xl focus:border-[#0B0E48] focus:ring-4 focus:ring-[#0B0E48]/40 focus:outline-none transition-all duration-300 shadow-inner"
            />
          </div>

          {/* Password */}
          <div className="w-full mb-6 relative">
            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-lg text-[#0B0E48] placeholder-gray-400 border-2 border-gray-300 rounded-xl focus:border-[#0B0E48] focus:ring-4 focus:ring-[#0B0E48]/40 focus:outline-none transition-all duration-300 shadow-inner"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300
${
  loading
    ? "bg-gray-400 cursor-not-allowed"
    : "bg-gradient-to-r from-[#0B0E48] to-[#05073f] hover:scale-105 hover:shadow-2xl hover:brightness-110"
}
text-white`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-gray-600 mt-2 text-sm">
            Welcome back, administrator
          </p>
        </form>
      </main>
      {/* Footer */}
      <Footer />

      {/* Tailwind animation for subtle background gradient movement */}
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
