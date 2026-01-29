import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../prisma";

export interface AdminRequest extends Request {
  admin?: {
    userId: number;
    role: "ADMIN";
  };
}

export const adminAuth = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (decoded.role !== "ADMIN" || typeof decoded.userId !== "number") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const admin = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { passwordUpdatedAt: true },
    });

    if (!admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔥 TOKEN INVALIDATION CHECK
    if (decoded.iat && admin.passwordUpdatedAt) {
      if (admin.passwordUpdatedAt.getTime() / 1000 > decoded.iat) {
        return res
          .status(401)
          .json({ message: "Token expired due to password change" });
      }
    }

    req.admin = {
      userId: decoded.userId,
      role: "ADMIN",
    };

    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
