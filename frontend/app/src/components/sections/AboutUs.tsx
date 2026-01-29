"use client";

export default function AboutUs() {
  return (
    <section
      id="about"
      className="w-full bg-white py-24 px-6 md:px-16 lg:px-24 xl:px-32"
    >
      <div className="max-w-6xl mx-auto text-center md:text-left">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B0E48] mb-6 tracking-tight">
          About{" "}
          <span className="text-gradient bg-gradient-to-r from-[#0B0E48] to-gray-600 bg-clip-text text-transparent">
            Sistara Ed Tech
          </span>
        </h2>

        {/* Description */}
        <p className="text-[#0B0E48]/90 text-lg md:text-xl lg:text-2xl mb-12 max-w-3xl leading-relaxed mx-auto md:mx-0">
          At Sistara, we empower ambitious students to gain hands-on,
          industry-ready skills in technology. Our platform focuses on practical
          learning, real-world projects, and a guided path to prepare you for
          the future of work in software development and design.
        </p>

        {/* Key Highlights / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-6 bg-[#0B0E48]/5 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
            <h3 className="text-2xl font-bold text-[#0B0E48] mb-3">
              Hands-on Learning
            </h3>
            <p className="text-[#0B0E48]/90 text-base leading-relaxed">
              Build real projects and experience industry-standard workflows
              while learning.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-[#0B0E48]/5 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
            <h3 className="text-2xl font-bold text-[#0B0E48] mb-3">
              Expert Guidance
            </h3>
            <p className="text-[#0B0E48]/90 text-base leading-relaxed">
              Learn from professionals and mentors who know what the market
              demands.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-[#0B0E48]/5 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
            <h3 className="text-2xl font-bold text-[#0B0E48] mb-3">
              Career Focused
            </h3>
            <p className="text-[#0B0E48]/90 text-base leading-relaxed">
              Gain skills that directly prepare you for jobs, freelancing, and
              real tech opportunities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
