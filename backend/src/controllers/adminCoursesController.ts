import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";
import { AppError } from "../middleware/errorHandler";

// GET ALL COURSES WITH PHASES
export const getCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    const mapped = courses.map((course) => ({
      id: course.id,
      title: course.title,
      months: course.months,
      phases: course.phases.map((phase) => phase.name)
    }));

    return res.json(mapped);
  } catch (error) {
    next(error);
  }
};
