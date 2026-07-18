import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";
import { AppError } from "../middleware/errorHandler";
import cloudinary from "../utils/cloudinary";
import { Readable } from "stream";

const uploadPDF = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "sistara/notes"
      },

      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!.secure_url);
        }
      }
    );

    Readable.from(file.buffer).pipe(stream);
  });
};
// =========================
// CREATE LESSON
// =========================
export const createLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, weekId, courseId, videoLinks } = req.body;

    if (!title || !weekId || !courseId) {
      throw new AppError("Missing required fields", 400);
    }

    let videos: string[] = [];

    if (videoLinks) {
      videos =
        typeof videoLinks === "string" ? JSON.parse(videoLinks) : videoLinks;
    }

    const files = req.files as Express.Multer.File[] | undefined;

    let notesUrls: string[] = [];

    if (files && files.length > 0) {
      notesUrls = await Promise.all(files.map((file) => uploadPDF(file)));
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        weekId: Number(weekId),
        courseId: Number(courseId),
        videoLinks: videos,
        notesUrls
      }
    });

    return res.status(201).json(lesson);
  } catch (error) {
    next(error);
  }
};

// =========================
// ADD VIDEO TO LESSON
// =========================
export const addVideoToLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lessonId = Number(req.params.lessonId);
    const { videoLink } = req.body;

    if (!videoLink) throw new AppError("Video link required", 400);
    if (isNaN(lessonId)) throw new AppError("Invalid lesson ID", 400);

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: { videoLinks: { push: videoLink } }
    });

    return res.json(lesson);
  } catch (error) {
    next(error);
  }
};

// =========================
// ADD NOTE TO LESSON
// =========================
export const addNoteToLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lessonId = Number(req.params.lessonId);
    if (isNaN(lessonId)) throw new AppError("Invalid lesson ID", 400);

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0)
      throw new AppError("No files uploaded", 400);

    const noteUrls = files.map((file) => `/uploads/notes/${file.filename}`);

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new AppError("Lesson not found", 404);

    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: { notesUrls: [...lesson.notesUrls, ...noteUrls] }
    });

    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

// =========================
// DELETE VIDEO FROM LESSON
// =========================
export const deleteVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lessonId = Number(req.params.lessonId);
    const { videoLink } = req.body;

    if (!videoLink) throw new AppError("Video link required", 400);
    if (isNaN(lessonId)) throw new AppError("Invalid lesson ID", 400);

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new AppError("Lesson not found", 404);

    const updatedVideos = lesson.videoLinks.filter((v) => v !== videoLink);

    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: { videoLinks: updatedVideos }
    });

    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

// =========================
// DELETE NOTE FROM LESSON
// =========================
export const deleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lessonId = Number(req.params.lessonId);
    const { noteUrl } = req.body;

    if (!noteUrl) throw new AppError("Note URL required", 400);
    if (isNaN(lessonId)) throw new AppError("Invalid lesson ID", 400);

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new AppError("Lesson not found", 404);

    const updatedNotes = lesson.notesUrls.filter((n) => n !== noteUrl);

    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: { notesUrls: updatedNotes }
    });

    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

// =========================
// DELETE ENTIRE LESSON
// =========================
export const deleteLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lessonId = Number(req.params.lessonId);

    if (isNaN(lessonId)) {
      throw new AppError("Invalid lesson ID", 400);
    }

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId
      }
    });

    if (!lesson) {
      throw new AppError("Lesson not found", 404);
    }

    await prisma.$transaction([
      prisma.lessonAccess.deleteMany({
        where: {
          lessonId
        }
      }),

      prisma.lessonProgress.deleteMany({
        where: {
          lessonId
        }
      }),

      prisma.lesson.delete({
        where: {
          id: lessonId
        }
      })
    ]);

    return res.json({
      message: "Lesson deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// GET FULL WEEK CONTENT
// =========================
export const getFullWeekContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const weekId = Number(req.params.weekId);
    if (isNaN(weekId)) throw new AppError("Invalid week ID", 400);

    const lessons = await prisma.lesson.findMany({
      where: { weekId },
      orderBy: { id: "asc" }
    });

    return res.json(lessons);
  } catch (error) {
    next(error);
  }
};
