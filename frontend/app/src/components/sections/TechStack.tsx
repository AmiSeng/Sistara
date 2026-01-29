"use client";

export default function TechStack() {
  const logos = [
    {
      name: "HTML5",
      src: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
    },
    {
      name: "CSS3",
      src: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg",
    },
    {
      name: "JavaScript",
      src: "https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg",
    },
    {
      name: "Bootstrap",
      src: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg",
    },
    {
      name: "React",
      src: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    },
    {
      name: "Git",
      src: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-logo.svg",
    },
    {
      name: "Node.js",
      src: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
    },
    {
      name: "Express.js",
      src: "Express.jpg",
    },
    {
      name: "REST API",
      src: "Rest.jpg",
    },

    {
      name: "MySQL",
      src: "https://upload.wikimedia.org/wikipedia/en/d/dd/MySQL_logo.svg",
    },
    {
      name: "React Router",
      src: "https://logo.svgcdn.com/logos/react-router.svg",
    },
    {
      name: "jQuery",
      src: "jQuery.jpg",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-[#0B0E48] mb-12">
          Our Tech Stack
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {logos.map((logo) => (
            <div key={logo.name} className="flex flex-col items-center">
              <img
                src={logo.src}
                alt={`${logo.name} logo`}
                className="w-16 h-16 object-contain mb-2"
              />
              <span className="text-sm md:text-base text-[#0B0E48] font-medium">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
