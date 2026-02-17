import { prisma } from "../prisma";
import { Request, Response } from "express";

// =========================
// CREATE LESSON
// =========================
export const createLesson = async (req: Request, res: Response) => {
  try {
    const { title, weekId, courseId } = req.body;
    let videoLinks = req.body.videoLinks || [];

    if (!title || !weekId || !courseId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (typeof videoLinks === "string") videoLinks = [videoLinks];

    const files = req.files as Express.Multer.File[] | undefined;
    const notesUrls = files
      ? files.map((file) => `/uploads/notes/${file.filename}`)
      : [];

    const lesson = await prisma.lesson.create({
      data: {
        title,
        weekId: Number(weekId),
        courseId: Number(courseId),
        videoLinks,
        notesUrls
      }
    });

    res.status(201).json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lesson creation failed" });
  }
};

// =========================
// ADD VIDEO TO LESSON
// =========================
export const addVideoToLesson = async (req: Request, res: Response) => {
  try {
    const lessonId = Number(req.params.lessonId);
    const { videoLink } = req.body;

    if (!videoLink)
      return res.status(400).json({ message: "Video link required" });

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: { videoLinks: { push: videoLink } }
    });

    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed adding video" });
  }
};

// =========================
// ADD NOTE TO LESSON
// =========================
export const addNoteToLesson = async (req: Request, res: Response) => {
  try {
    const lessonId = Number(req.params.lessonId);

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const noteUrls = files.map((file) => `/uploads/notes/${file.filename}`);

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        notesUrls: [...lesson.notesUrls, ...noteUrls]
      }
    });

    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed uploading notes" });
  }
};

// =========================
// DELETE VIDEO FROM LESSON
// =========================
export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const lessonId = Number(req.params.lessonId);
    const { videoLink } = req.body;

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const updatedVideos = lesson.videoLinks.filter((v) => v !== videoLink);

    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: { videoLinks: updatedVideos }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed deleting video" });
  }
};

// =========================
// DELETE NOTE FROM LESSON
// =========================
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const lessonId = Number(req.params.lessonId);
    const { noteUrl } = req.body;

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const updatedNotes = lesson.notesUrls.filter((n) => n !== noteUrl);

    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: { notesUrls: updatedNotes }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed deleting note" });
  }
};

// =========================
// GET FULL WEEK CONTENT
// =========================
export const getFullWeekContent = async (req: Request, res: Response) => {
  try {
    const weekId = Number(req.params.weekId);

    const lessons = await prisma.lesson.findMany({
      where: { weekId },
      orderBy: { id: "asc" }
    });

    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed fetching week content" });
  }
};
