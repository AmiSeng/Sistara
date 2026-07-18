import bcrypt from "bcrypt";
import { Response, NextFunction } from "express";
import { prisma } from "../prisma";
import { StudentRequest } from "../middleware/studentAuth";
import { AppError } from "../middleware/errorHandler";

/**
 * GET STUDENT PROFILE
 */
export const getStudentProfile = async (
  req: StudentRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const student = await prisma.user.findUnique({
      where: {
        id: req.student!.userId
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phoneNumber: true,
        currentPhase: true,
        specialization: true,
        status: true
      }
    });

    if (!student) {
      throw new AppError("Student not found", 404);
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE USERNAME
 */
export const updateStudentUsername = async (
  req: StudentRequest,
  res: Response,
  next: NextFunction
) => {
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
      },

      select: {
        id: true,
        username: true
      }
    });

    res.json({
      message: "Username updated successfully",
      student: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CHANGE PASSWORD
 */
export const changeStudentPassword = async (
  req: StudentRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError("Current password and new password are required", 400);
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

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      student.password
    );

    if (!passwordMatch) {
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
};
