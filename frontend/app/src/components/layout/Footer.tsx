"use client";

import {
  FaPhoneAlt,
  FaTelegramPlane,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0B0E48] text-white py-6 px-6 md:px-12">
      {/* Contact Icons */}
      <div className="max-w-4xl mx-auto flex justify-center items-center gap-6">
        <a href="tel:+251982044940">
          <FaPhoneAlt className="text-2xl hover:text-gray-300 transition-colors duration-300 cursor-pointer" />
        </a>

        <a
          href="https://t.me/Sistara_edtech"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTelegramPlane className="text-2xl hover:text-gray-300 transition-colors duration-300 cursor-pointer" />
        </a>

        <a
          href="https://wa.me/251982044940"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="text-2xl hover:text-gray-300 transition-colors duration-300 cursor-pointer" />
        </a>
        <a href="mailto:sistara2026@gmail.com">
          <FaEnvelope className="text-2xl hover:text-gray-300 transition-colors duration-300 cursor-pointer" />
        </a>
      </div>

      {/* Copyright */}
      <div className="text-center text-white/70 text-sm mt-4">
        &copy; {new Date().getFullYear()} Sistara. All rights reserved.
      </div>
    </footer>
  );
}
