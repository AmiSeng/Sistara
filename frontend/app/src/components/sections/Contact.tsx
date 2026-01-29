"use client";

import {
  FaPhoneAlt,
  FaTelegramPlane,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

export default function Contact() {
  return (
    <section
      id="contact"
      className="w-full bg-white py-24 px-6 md:px-16 lg:px-24 xl:px-32"
    >
      <div className="max-w-5xl mx-auto text-center md:text-left text-[#0B0E48]">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
          Contact <span className="text-gray-500">Us</span>
        </h2>

        {/* Description */}
        <p className="text-[#0B0E48]/80 text-lg md:text-xl mb-12 max-w-3xl leading-relaxed mx-auto md:mx-0">
          Reach out to Register. We are here to help and guide you through our
          programs.
        </p>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
          <div className="flex items-center gap-4 hover:translate-x-1 transition-transform duration-300">
            <FaPhoneAlt className="text-[#0B0E48] text-2xl" />
            <span className="text-lg md:text-xl">+251 912 345 678</span>
          </div>
          <div className="flex items-center gap-4 hover:translate-x-1 transition-transform duration-300">
            <FaEnvelope className="text-[#0B0E48] text-2xl" />
            <span className="text-lg md:text-xl">contact@sistara.com</span>
          </div>
          <div className="flex items-center gap-4 hover:translate-x-1 transition-transform duration-300">
            <FaTelegramPlane className="text-[#0B0E48] text-2xl" />
            <span className="text-lg md:text-xl">@SistaraEdu</span>
          </div>
          <div className="flex items-center gap-4 hover:translate-x-1 transition-transform duration-300">
            <FaWhatsapp className="text-[#0B0E48] text-2xl" />
            <span className="text-lg md:text-xl">+251 912 345 678</span>
          </div>
        </div>
      </div>
    </section>
  );
}
