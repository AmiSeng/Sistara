"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUsers,
  FaUserPlus,
  FaLayerGroup,
  FaPlayCircle,
} from "react-icons/fa";
import Footer from "../src/components/layout/Footer";

const metrics = [
  { label: "Total Students", value: 120, icon: <FaUsers /> },
  { label: "Total Cohorts", value: 3, icon: <FaLayerGroup /> },
  { label: "Active Cohorts", value: 2, icon: <FaPlayCircle /> },
  { label: "New Registrations", value: 15, icon: <FaUserPlus /> },
];

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          localStorage.removeItem("adminToken");
          router.push("/admin/login");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050728] via-[#0B0E48] to-[#141866] p-8 space-y-10">
      {/* MAIN CONTENT */}
      <div className="flex-1 space-y-10 px-4 md:px-8 py-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 flex flex-col md:flex-col gap-4">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#3f46ff] opacity-20 blur-3xl rounded-full" />
          <h1 className="text-3xl md:text-4xl font-extrabold relative z-10">
            Welcome back, Admin 👋
          </h1>
          <p className="relative z-10 text-white/80 max-w-2xl">
            Here’s what’s happening with your cohorts and students today.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="relative bg-white/20 backdrop-blur-xl rounded-3xl p-6 shadow-[0_20px_60px_rgba(11,14,72,0.25)]
             hover:shadow-[0_25px_70px_rgba(11,14,72,0.35)]
             hover:scale-[1.02] transition transform motion-safe:duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 h-1 w-full bg-[#0B0E48]" />
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0B0E48]/10 text-[#0B0E48] flex items-center justify-center text-2xl">
                  {m.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-300">{m.label}</p>
                  <p className="text-3xl font-extrabold text-white">
                    {m.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/admin/students"
            className="group relative bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-[0_20px_60px_rgba(11,14,72,0.25)]
             hover:shadow-[0_25px_70px_rgba(11,14,72,0.35)]
             hover:scale-[1.02] transition transform motion-safe:duration-300 flex flex-col"
          >
            <div className="text-5xl mb-4 text-[#0B0E48] group-hover:scale-110 transition-transform">
              👤
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Manage Students
            </h3>
            <p className="text-white/80 mt-1 text-sm">
              Register, update access, and monitor progress
            </p>
          </a>

          <a
            href="/admin/courses"
            className="group relative bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-[0_20px_60px_rgba(11,14,72,0.25)]
             hover:shadow-[0_25px_70px_rgba(11,14,72,0.35)]
             hover:scale-[1.02] transition transform motion-safe:duration-300 flex flex-col"
          >
            <div className="text-5xl mb-4 text-[#0B0E48] group-hover:scale-110 transition-transform">
              📚
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Manage Cohorts
            </h3>
            <p className="text-white/80 mt-1 text-sm">
              Phases, months, weeks, videos, and notes
            </p>
          </a>

          <a
            href="/admin/profile"
            className="group relative bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-[0_20px_60px_rgba(11,14,72,0.25)]
             hover:shadow-[0_25px_70px_rgba(11,14,72,0.35)]
             hover:scale-[1.02] transition transform motion-safe:duration-300 flex flex-col"
          >
            <div className="text-5xl mb-4 text-[#0B0E48] group-hover:scale-110 transition-transform">
              ⚙️
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Profile & Settings
            </h3>
            <p className="text-white/80 mt-1 text-sm">
              Security, preferences, and admin settings
            </p>
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
