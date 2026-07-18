import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../prisma";
import { Role } from "@prisma/client";

export interface AdminRequest extends Request {
  admin?: {
    userId: number;
    role: Role;
  };
}

export const adminAuth = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const userId = Number(decoded.userId);

    if (!userId || Number.isNaN(userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        role: true,
        passwordUpdatedAt: true
      }
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 🔥 TOKEN INVALIDATION CHECK
    if (decoded.iat && user.passwordUpdatedAt) {
      const tokenIssuedAt = decoded.iat;
      const passwordChangedAt = user.passwordUpdatedAt.getTime() / 1000;

      if (passwordChangedAt > tokenIssuedAt) {
        return res.status(401).json({
          message: "Token expired due to password change"
        });
      }
    }

    req.admin = {
      userId: user.id,
      role: user.role
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
