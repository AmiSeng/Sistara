import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";

export const getDashboardMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [totalStudents, activeStudents, totalCourses, totalLessons] =
      await Promise.all([
        prisma.user.count({
          where: {
            role: "STUDENT"
          }
        }),

        prisma.user.count({
          where: {
            role: "STUDENT",
            status: "ACTIVE"
          }
        }),

        prisma.course.count(),

        prisma.lesson.count()
      ]);

    res.json({
      totalStudents,
      activeStudents,
      totalCourses,
      totalLessons
    });
  } catch (error) {
    next(error);
  }
};
