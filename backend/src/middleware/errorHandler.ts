import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 ERROR:", err);

  if (err instanceof AppError) {
    return res.status(err.status).json({
      message: err.message
    });
  }

  return res.status(500).json({
    message: "Internal Server Error"
  });
};
