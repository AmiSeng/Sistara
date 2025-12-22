"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#0B0E48] px-4 md:px-12 py-4 flex flex-wrap items-center justify-between">
      {/* Left: Logo */}
      <div className="flex-shrink-0">
        <Link href="/">
          <div className="relative h-16 md:h-20 w-40 md:w-72 lg:w-80">
            <Image
              src="/mylogocp.png"
              alt="Sistara Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>
      </div>

      {/* Right: Navigation */}
      <div className="flex items-center md:flex-grow justify-end space-x-4 md:space-x-6 lg:space-x-8">
        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-4 md:space-x-6 lg:space-x-8 text-white text-lg font-medium">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link
            href="/login"
            className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-[#0B0E48] transition duration-300"
          >
            Login
          </Link>
        </nav>

        {/* Mobile menu toggle (shows on small & medium screens) */}
        <button
          className="md:hidden text-white text-2xl ml-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <nav className="w-full flex flex-col md:hidden mt-4 space-y-2 text-white text-lg font-medium">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link
            href="/login"
            className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-[#0B0E48] transition duration-300"
          >
            Login
          </Link>
        </nav>
      )}
    </header>
  );
}
