import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// POST /api/login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new AppError("Username and password are required", 400);
    }
    if (typeof username !== "string" || username.length < 3) {
      throw new AppError("Invalid username", 400);
    }
    if (typeof password !== "string" || password.length < 6) {
      throw new AppError("Invalid password", 400);
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new AppError("Invalid username or password", 401);
    }
    if (user.role !== "STUDENT") {
      throw new AppError("Student access only", 403);
    }
    if (user.status !== "ACTIVE") {
      throw new AppError("Account is inactive", 403);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AppError("Invalid username or password", 401);

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      student: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
