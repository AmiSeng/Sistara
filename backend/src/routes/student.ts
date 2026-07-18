import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../prisma";
import { studentAuth, StudentRequest } from "../middleware/studentAuth";
import { AppError } from "../middleware/errorHandler";

const router = Router();

/**
 * GET /api/student/profile
 */
router.get("/profile", studentAuth, async (req: StudentRequest, res, next) => {
  try {
    const student = await prisma.user.findUnique({
      where: { id: req.student!.userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phoneNumber: true,
        currentPhase: true,
        specialization: true
      }
    });

    if (!student) throw new AppError("Student not found", 404);

    res.json(student);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/student/profile/username
 */
router.put(
  "/profile/username",
  studentAuth,
  async (req: StudentRequest, res, next) => {
    try {
      const { username } = req.body;

      if (!username || username.length < 3) {
        throw new AppError("Invalid username", 400);
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: {
            id: req.student!.userId
          }
        }
      });

      if (existingUser) {
        throw new AppError("Username already exists", 409);
      }

      const updated = await prisma.user.update({
        where: {
          id: req.student!.userId
        },
        data: {
          username
        }
      });

      res.json({
        message: "Username updated successfully",
        username: updated.username
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/student/profile/password
 */
router.put(
  "/profile/password",
  studentAuth,
  async (req: StudentRequest, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new AppError(
          "Current password and new password are required",
          400
        );
      }

      if (newPassword.length < 6) {
        throw new AppError("Password must be at least 6 characters", 400);
      }

      const student = await prisma.user.findUnique({
        where: {
          id: req.student!.userId
        }
      });

      if (!student) {
        throw new AppError("Student not found", 404);
      }

      const match = await bcrypt.compare(currentPassword, student.password);

      if (!match) {
        throw new AppError("Current password is incorrect", 401);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: {
          id: req.student!.userId
        },
        data: {
          password: hashedPassword,
          passwordUpdatedAt: new Date()
        }
      });

      res.json({
        message: "Password updated successfully"
      });
    } catch (error) {
      next(error);
    }
  }
);
/**
 * GET /api/student/courses
 */
/**
 * GET /api/student/courses
 */
router.get("/courses", studentAuth, async (req: StudentRequest, res, next) => {
  try {
    const userId = req.student!.userId;

    // Get student information
    const student = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        specialization: true,
        status: true
      }
    });

    if (!student) {
      throw new AppError("Student not found", 404);
    }

    if (student.status === "INACTIVE") {
      throw new AppError("Your account is inactive", 403);
    }

    // Decide visible courses
    const courseTitles = ["Beginner"];

    if (student.specialization === "FRONTEND") {
      courseTitles.push("Frontend");
    }

    if (student.specialization === "BACKEND") {
      courseTitles.push("Backend");
    }

    if (student.specialization === "FULLSTACK") {
      courseTitles.push("Fullstack");
    }

    // Get curriculum
    const courses = await prisma.course.findMany({
      where: {
        title: {
          in: courseTitles
        }
      },

      include: {
        phases: {
          include: {
            months: {
              orderBy: {
                monthNum: "asc"
              }
            }
          }
        }
      },

      orderBy: {
        id: "asc"
      }
    });

    // Get payment status
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId
      }
    });

    const result = courses.map((course) => {
      return {
        id: course.id,
        title: course.title,

        phases: course.phases.map((phase) => {
          return {
            id: phase.id,
            name: phase.name,

            months: phase.months.map((month) => {
              const subscription = subscriptions.find(
                (sub) =>
                  sub.courseId === course.id && sub.month === month.monthNum
              );

              return {
                id: month.id,
                monthNum: month.monthNum,

                accessible: subscription?.paid === true
              };
            })
          };
        })
      };
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/student/course/:courseId/month/:monthNum
 */
router.get<{ courseId: string; monthNum: string }>(
  "/course/:courseId/month/:monthNum",
  studentAuth,
  async (req: StudentRequest, res, next) => {
    try {
      const userId = req.student!.userId;

      const { courseId, monthNum } = req.params;

      const parsedCourseId = Number(courseId);
      const parsedMonthNum = Number(monthNum);

      if (isNaN(parsedCourseId) || isNaN(parsedMonthNum)) {
        throw new AppError("Parameters must be numbers", 400);
      }

      const subscription = await prisma.subscription.findFirst({
        where: {
          userId,
          courseId: parsedCourseId,
          month: parsedMonthNum,
          paid: true

          //status: "APPROVED"
        }
      });

      if (!subscription) {
        throw new AppError("You have not paid for this month", 403);
      }

      const lessons = await prisma.lesson.findMany({
        where: {
          courseId: parsedCourseId,

          week: {
            month: {
              monthNum: parsedMonthNum
            }
          }
        }
      });

      res.json(lessons);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
