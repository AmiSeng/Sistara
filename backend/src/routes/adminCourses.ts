// routes/adminCourses.ts
import { Router } from "express";
import { prisma } from "../prisma"; // adjust the path if needed

export const adminCoursesRouter = Router();

// GET /api/admin/courses
adminCoursesRouter.get("/", async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      select: { id: true, phase: true },
    });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});
