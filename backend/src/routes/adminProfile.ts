import { Router } from "express";
import { prisma } from "../prisma";
import { adminAuth, AdminRequest } from "../middleware/adminAuth";
import {
  isValidName,
  isValidEmail,
  isValidEthiopianPhone,
  isStrongPassword,
} from "../utils/validator";
import { comparePassword, hashPassword } from "../utils/security";

const router = Router();

// Update admin profile
router.put("/profile", adminAuth, async (req: AdminRequest, res) => {
  const { name, username, email, phoneNumber } = req.body;

  if (!name || !username || !email)
    return res.status(400).json({ message: "Missing fields" });
  if (!isValidName(name))
    return res.status(400).json({ message: "Invalid name" });
  if (!isValidEmail(email))
    return res.status(400).json({ message: "Invalid email" });
  if (phoneNumber && !isValidEthiopianPhone(phoneNumber))
    return res.status(400).json({ message: "Invalid Ethiopian phone number" });

  try {
    const updated = await prisma.user.update({
      where: { id: req.admin!.userId },
      data: { name, username, email, phoneNumber },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phoneNumber: true,
        role: true,
      },
    });

    res.json(updated);
  } catch (err: any) {
    if (err.code === "P2002")
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    res.status(500).json({ message: "Server error" });
  }
});

// Change admin password
router.put("/password", adminAuth, async (req: AdminRequest, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: "Missing fields" });
  if (!isStrongPassword(newPassword))
    return res.status(400).json({
      message: "Password must be 8+ chars, include upper, lower, number",
    });

  const admin = await prisma.user.findUnique({
    where: { id: req.admin!.userId },
  });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const valid = await comparePassword(currentPassword, admin.password);
  if (!valid)
    return res.status(401).json({ message: "Current password incorrect" });

  const hashed = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: admin.id },
    data: { password: hashed, passwordUpdatedAt: new Date() },
  });

  res.json({ message: "Password updated successfully" });
});

export default router;
