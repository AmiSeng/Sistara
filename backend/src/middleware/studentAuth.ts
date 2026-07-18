import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../prisma";

export interface StudentRequest extends Request {
  student?: {
    userId: number;
    role: "STUDENT";
  };
}

export const studentAuth = async (
  req: StudentRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (decoded.role !== "STUDENT" || typeof decoded.userId !== "number") {
      console.log("ROLE CHECK FAILED", {
        role: decoded.role,
        userId: decoded.userId
      });

      return res.status(403).json({ message: "Forbidden" });
    }
    const student = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { passwordUpdatedAt: true }
    });

    if (!student) return res.status(401).json({ message: "Unauthorized" });

    req.student = {
      userId: decoded.userId,
      role: "STUDENT"
    };

    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
