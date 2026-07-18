// controllers/adminStudentController.ts
import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

/* =========================
   ZOD SCHEMAS
========================= */
export const createStudentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  username: z.string().min(2, "Username is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
  phoneNumber: z.string().optional()
});

export const updateStudentSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  specialization: z.enum(["FRONTEND", "BACKEND", "FULLSTACK"]).optional()
});

export const toggleSubscriptionSchema = z.object({
  courseId: z.number().refine((v) => !isNaN(v), {
    message: "Course ID is required and must be a number"
  }),
  month: z.number().refine((v) => !isNaN(v), {
    message: "Month number is required and must be a number"
  }),
  paid: z.boolean()
});

/* =========================
   GET ALL STUDENTS
========================= */
export const getStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: "STUDENT", status: "ACTIVE" },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        subscriptions: true,
        status: true,
        currentPhase: true,
        specialization: true
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(students);
  } catch (err) {
    next(err);
  }
};

/* =========================
   CREATE STUDENT
========================= */
export const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = createStudentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.format() });
    }

    const { name, username, email, password, phoneNumber } = parsed.data;

    // Check if student already exists
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    });

    if (existing) {
      return res.status(409).json({ message: "Student already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.user.create({
      data: {
        name,
        username,
        email,
        phoneNumber: phoneNumber ?? null,
        password: hashedPassword,
        role: "STUDENT",
        status: "ACTIVE",
        currentPhase: "BEGINNER",
        specialization: null
      }
    });

    res
      .status(201)
      .json({ message: "Student successfully registered", student });
  } catch (err) {
    next(err);
  }
};

/* =========================
   UPDATE STUDENT
========================= */
export const updateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const parsed = updateStudentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.format() });
    }

    const { name, email, phoneNumber, status, specialization } = parsed.data;

    // Build update object safely
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber ?? null;
    if (status !== undefined) updateData.status = status;
    if (specialization !== undefined)
      updateData.specialization = specialization ?? null;

    const student = await prisma.user.update({
      where: {
        id,
        role: "STUDENT"
      },
      data: updateData
    });

    res.json({ message: "Student updated successfully", student });
  } catch (err) {
    next(err);
  }
};

/* =========================
   DISABLE STUDENT
========================= */
export const disableStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const student = await prisma.user.update({
      where: {
        id,
        role: "STUDENT"
      },
      data: {
        status: "INACTIVE"
      }
    });

    // Revoke access
    await prisma.lessonAccess.deleteMany({ where: { userId: id } });
    await prisma.lessonProgress.deleteMany({ where: { userId: id } });

    // Mark subscriptions as unpaid
    await prisma.subscription.updateMany({
      where: { userId: id },
      data: { paid: false }
    });

    res.json({ message: "Student disabled and access revoked", student });
  } catch (err) {
    next(err);
  }
};

/* =========================
   MANUAL SUBSCRIPTION / PAYMENT
========================= */
export const toggleSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.userId);

    // Validate input
    const parsed = toggleSubscriptionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.format() });
    }

    const { courseId, month, paid } = parsed.data;

    let subscription = await prisma.subscription.findFirst({
      where: { userId, courseId, month }
    });

    if (subscription) {
      subscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data: { paid }
      });
    } else {
      subscription = await prisma.subscription.create({
        data: { userId, courseId, month, paid }
      });
    }

    res.json({ message: "Subscription updated successfully", subscription });
  } catch (err) {
    next(err);
  }
};
