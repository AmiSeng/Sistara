import { prisma } from "../prisma";

// GET ALL COURSES WITH PHASES
export const getCourses = async (req: any, res: any) => {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        months: true,
        phases: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { id: "asc" }
    });

    // Map for frontend-friendly format
    const mapped = courses.map((course) => ({
      id: course.id,
      title: course.title,
      months: course.months,
      phases: course.phases.map((phase) => phase.name)
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Failed to fetch courses:", err);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};
