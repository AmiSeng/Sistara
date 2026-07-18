// app/student/layout.tsx

"use client";

import Link from "next/link";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050728] via-[#0B0E48] to-[#141866]">
      <nav className="border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8 text-white">
          <Link href="/student/dashboard">Dashboard</Link>
          <Link href="/student/courses">My Courses</Link>
          <Link href="/student/profile">Profile</Link>
        </div>
      </nav>

      {children}
    </div>
  );
}
