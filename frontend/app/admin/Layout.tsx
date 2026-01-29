"use client";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { FaUsers, FaBook, FaUserCog, FaChartBar } from "react-icons/fa";
import { useAdminAuth } from "../src/hooks/useAdminAuth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: <FaChartBar /> },
    { label: "Students", href: "/admin/students", icon: <FaUsers /> },
    { label: "Courses", href: "/admin/courses", icon: <FaBook /> },
    { label: "Profile", href: "/admin/profile", icon: <FaUserCog /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <span
            className={`font-extrabold text-xl ${
              sidebarOpen ? "text-[#0B0E48]" : "text-[#0B0E48]/0"
            } transition-all duration-300`}
          >
            SISTARA Admin
          </span>
          <button
            className="text-gray-500 text-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>

        <nav className="flex-1 mt-6 flex flex-col gap-2 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#0B0E48]/10 text-gray-700 hover:text-[#0B0E48] font-medium transition-all duration-300"
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t">
          <button className="w-full bg-[#0B0E48] text-white py-2 rounded-xl hover:brightness-110 transition-all duration-300">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <span className="font-medium text-gray-700">Welcome, Admin</span>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
