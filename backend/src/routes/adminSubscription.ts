import { Router } from "express";
import { prisma } from "../prisma";
import { adminAuth } from "../middleware/adminAuth";

const router = Router();

router.patch("/:userId", adminAuth, async (req, res) => {
  const userId = Number(req.params.userId);
  const { courseId, month, paid } = req.body;

  // Validate that course exists
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return res.status(400).json({ message: "Invalid courseId" });
  }

  const existing = await prisma.subscription.findFirst({
    where: { userId, courseId, month },
  });

  if (existing) {
    await prisma.subscription.update({
      where: { id: existing.id },
      data: { paid },
    });
  } else {
    await prisma.subscription.create({
      data: { userId, courseId, month, paid },
    });
  }

  res.json({ success: true });
});

export default router;
