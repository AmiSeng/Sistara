export default function TechStack() {
  const techs = [
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Express",
    "PostgreSQL",
  ];

  return (
    <section className="py-24 px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Tech Stack</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
        {techs.map((tech) => (
          <div
            key={tech}
            className="border rounded-lg p-4 flex items-center justify-center text-lg font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            {tech}
          </div>
        ))}
      </div>
    </section>
  );
}
