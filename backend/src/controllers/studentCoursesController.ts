// controllers/studentCoursesController.ts

import { Response, NextFunction } from "express";
import { prisma } from "../prisma";
import { StudentRequest } from "../middleware/studentAuth";

export const getStudentCourses = async (
  req: StudentRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.student?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const courses = await prisma.course.findMany({
      where: {
        subscriptions: {
          some: {
            userId
          }
        }
      },
      orderBy: {
        title: "asc"
      }
    });

    res.json(courses);
  } catch (err) {
    next(err);
  }
};
