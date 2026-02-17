// controllers/adminStudentController.ts
import { prisma } from "../prisma";
import bcrypt from "bcrypt";

/* =========================
   GET ALL STUDENTS
========================= */
export const getStudents = async (req: any, res: any) => {
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
    console.error(err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

/* =========================
   CREATE STUDENT
========================= */
export const createStudent = async (req: any, res: any) => {
  try {
    const { name, username, email, password, phoneNumber } = req.body;

    if (!name || !username || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

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
        phoneNumber,
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
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to create student" });
  }
};

/* =========================
   UPDATE STUDENT
========================= */
export const updateStudent = async (req: any, res: any) => {
  try {
    const id = Number(req.params.id);
    const { role, name, email, phoneNumber, status, specialization } = req.body;

    const student = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phoneNumber,
        status,
        specialization: Array.isArray(specialization)
          ? (specialization[0] ?? null)
          : (specialization ?? null)
      }
    });

    res.json({ message: "Student updated successfully", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update student" });
  }
};

/* =========================
   DISABLE STUDENT (SOFT DELETE)
========================= */
export const disableStudent = async (req: any, res: any) => {
  try {
    const id = Number(req.params.id);

    // Soft delete: mark as inactive
    const student = await prisma.user.update({
      where: { id },
      data: { status: "INACTIVE" }
    });

    // Remove lesson access
    await prisma.lessonAccess.deleteMany({ where: { userId: id } });

    // Remove progress
    await prisma.lessonProgress.deleteMany({ where: { userId: id } });

    // Mark subscriptions unpaid
    await prisma.subscription.updateMany({
      where: { userId: id },
      data: { paid: false }
    });

    res.json({ message: "Student access revoked and disabled", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to disable student" });
  }
};
/* =========================
   TOGGLE / UPDATE SUBSCRIPTION
========================= */
export const toggleSubscription = async (req: any, res: any) => {
  try {
    const userId = Number(req.params.userId);
    const { courseId, month, paid } = req.body;

    if (!userId || !courseId || !month) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if subscription already exists
    let subscription = await prisma.subscription.findFirst({
      where: { userId, courseId, month }
    });

    if (subscription) {
      // Update paid status
      subscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data: { paid }
      });
    } else {
      // Create new subscription
      subscription = await prisma.subscription.create({
        data: {
          userId,
          courseId,
          month,
          paid: paid ?? true
        }
      });
    }

    res.json({ message: "Subscription updated successfully", subscription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update subscription" });
  }
};
