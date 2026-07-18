import { Router } from "express";
import { prisma } from "../prisma";
import { adminAuth, AdminRequest } from "../middleware/adminAuth";
import {
  isValidName,
  isValidEmail,
  isValidEthiopianPhone,
  isStrongPassword
} from "../utils/validator";
import { comparePassword, hashPassword } from "../utils/security";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// Update admin profile
router.put("/profile", adminAuth, async (req: AdminRequest, res, next) => {
  try {
    const { name, username, email, phoneNumber } = req.body;

    if (!name || !username || !email) throw new AppError("Missing fields", 400);
    if (!isValidName(name)) throw new AppError("Invalid name", 400);
    if (!isValidEmail(email)) throw new AppError("Invalid email", 400);
    if (phoneNumber && !isValidEthiopianPhone(phoneNumber))
      throw new AppError("Invalid Ethiopian phone number", 400);

    const updated = await prisma.user.update({
      where: { id: req.admin!.userId },
      data: { name, username, email, phoneNumber },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phoneNumber: true,
        role: true
      }
    });

    res.json(updated);
  } catch (err: any) {
    if (err.code === "P2002")
      return next(new AppError("Username or email already exists", 409));
    next(err);
  }
});

// Change admin password
router.put("/password", adminAuth, async (req: AdminRequest, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      throw new AppError("Missing fields", 400);
    if (!isStrongPassword(newPassword))
      throw new AppError(
        "Password must be 8+ chars, include upper, lower, number",
        400
      );

    const admin = await prisma.user.findUnique({
      where: { id: req.admin!.userId }
    });
    if (!admin) throw new AppError("Admin not found", 404);

    const valid = await comparePassword(currentPassword, admin.password);
    if (!valid) throw new AppError("Current password incorrect", 401);

    const hashed = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: admin.id },
      data: { password: hashed, passwordUpdatedAt: new Date() }
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
