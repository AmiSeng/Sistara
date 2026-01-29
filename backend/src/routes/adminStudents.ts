import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../prisma";
import { adminAuth } from "../middleware/adminAuth";

const router = Router();

/* ================= GET ALL STUDENTS ================= */
router.get("/", adminAuth, async (_, res) => {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      phoneNumber: true,
      createdAt: true,
      subscriptions: {
        select: {
          course: { select: { phase: true } },
          month: true,
          paid: true,
        },
      },
    },
  });

  res.json(students);
});

/* ================= CREATE STUDENT ================= */
router.post("/", adminAuth, async (req, res) => {
  const { name, username, email, phone, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const hash = await bcrypt.hash(password, 10);

  const student = await prisma.user.create({
    data: {
      name,
      username,
      email,
      phoneNumber: phone,
      password: hash,
      role: "STUDENT",
    },
  });

  res.status(201).json({ id: student.id });
});

/* ================= UPDATE STUDENT ================= */
router.put("/:id", adminAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, phone, status } = req.body;

  await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      phoneNumber: phone,
    },
  });

  res.json({ success: true });
});

/* ================= DELETE STUDENT ================= */
router.delete("/:id", adminAuth, async (req, res) => {
  const id = Number(req.params.id);

  await prisma.user.delete({ where: { id } });

  res.json({ success: true });
});

export default router;
