import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";
import { AppError } from "../middleware/errorHandler";

export const getCurriculum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        id: "asc"
      },

      include: {
        phases: {
          orderBy: {
            id: "asc"
          },

          include: {
            months: {
              orderBy: {
                monthNum: "asc"
              },

              include: {
                weeks: {
                  orderBy: {
                    weekNum: "asc"
                  },

                  include: {
                    lessons: {
                      orderBy: {
                        id: "asc"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    return res.json(courses);
  } catch (error) {
    next(error);
  }
};
