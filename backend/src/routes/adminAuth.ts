import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";
import { adminAuth, AdminRequest } from "../middleware/adminAuth";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// GET /api/admin/me
router.get("/me", adminAuth, async (req: AdminRequest, res, next) => {
  try {
    const admin = await prisma.user.findUnique({
      where: { id: req.admin!.userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phoneNumber: true,
        role: true
      }
    });

    if (!admin) throw new AppError("Admin not found", 404);

    res.json(admin);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      throw new AppError("Username and password are required", 400);
    if (typeof username !== "string" || username.length < 3)
      throw new AppError("Invalid username", 400);
    if (typeof password !== "string" || password.length < 6)
      throw new AppError("Invalid password", 400);

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) throw new AppError("Invalid credentials", 401);
    if (user.role !== "ADMIN") throw new AppError("Admin access only", 403);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AppError("Invalid credentials", 401);

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      admin: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
