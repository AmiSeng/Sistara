"use client";

export default function Development() {
  const courses = [
    {
      level: "Beginner",
      duration: "4 Months",
      topics: [
        "Introduction to Computer Basics",
        "Introduction to Software Engineering and Development",
        "Introduction to Website Development",
        "Git and GitHub",
        "HTML, CSS, Bootstrap",
        "JavaScript & Basic Programming",
        "Responsive Web Development",
      ],
    },
    {
      level: "Intermediate",
      duration: "3 Months",
      topics: [
        "React Framework",
        "Node.js",
        "Express.js",
        "MySQL",
        "Full-Stack Web Development",
      ],
    },
    {
      level: "Advanced",
      duration: "2 Months",
      topics: [
        "Cloning Projects",
        "Re-cloning Our Projects",
        "Building Own Project Solving Real-World Problem",
        "Introduction to Upwork & Freelancing",
      ],
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B0E48] mb-16">
          Full-Stack Development Program
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {courses.map((course) => (
            <div
              key={course.level}
              className="
                group relative p-10 rounded-3xl
                bg-blue-50
                shadow-[0_10px_30px_rgba(11,14,72,0.15)]
                transition-all duration-500 ease-out
                hover:scale-[1.06]
                hover:-translate-y-3
                hover:shadow-[0_25px_60px_rgba(11,14,72,0.35)]
                overflow-hidden
              "
            >
              {/* Glow / light effect */}
              <div
                className="
                  absolute inset-0 opacity-0 group-hover:opacity-100
                  transition duration-500
                  bg-gradient-to-br from-white/60 via-white/30 to-transparent
                "
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-3xl font-bold text-[#0B0E48] mb-2">
                  {course.level}
                </h3>

                <p className="text-lg font-medium text-[#0B0E48]/70 mb-6">
                  {course.duration}
                </p>

                <ul className="space-y-3 text-gray-700 text-left">
                  {course.topics.map((topic, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2 text-[#0B0E48] font-bold">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
