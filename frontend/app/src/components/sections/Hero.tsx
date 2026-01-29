"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-screen overflow-hidden bg-[#0B0E48]">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/download.jpg"
          alt="Luxury technology background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0E48]/95 via-[#0B0E48]/75 to-[#0B0E48]/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="px-6 md:px-20 lg:px-28 xl:px-36 max-w-[1400px] text-center">
          {/* Brand Title */}
          <h1 className="mb-8 leading-tight">
            <span
              className="block text-white font-extrabold tracking-tight
                             text-5xl sm:text-6xl md:text-7xl xl:text-8xl"
            >
              Sistara
            </span>

            <span
              className="block mt-2 text-white/60 font-medium tracking-[0.25em]
                             uppercase text-sm md:text-base"
            >
              Ed Tech
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl text-white/85 text-lg md:text-xl lg:text-2xl mb-12 mx-auto">
            A premium education platform designed to build real-world,
            industry-ready technology skills through hands-on learning.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#contact">
              <button
                className="px-10 py-4 rounded-full bg-white text-[#0B0E48]
                               font-semibold text-lg
                               hover:bg-gray-100 transition-all duration-300
                               shadow-lg hover:shadow-xl"
              >
                Join Now
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
