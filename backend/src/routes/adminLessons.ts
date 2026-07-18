import { Router } from "express";
import { adminAuth, AdminRequest } from "../middleware/adminAuth";
import { uploadNotes } from "../utils/upload";
import {
  createLesson,
  addVideoToLesson,
  addNoteToLesson,
  deleteVideo,
  deleteNote,
  deleteLesson,
  getFullWeekContent
} from "../controllers/adminLessonController";

const router = Router();

// =========================
// GET FULL WEEK CONTENT
// =========================
router.get("/:weekId", adminAuth, getFullWeekContent);

// =========================
// CREATE LESSON + UPLOAD NOTES
// =========================
router.post("/", adminAuth, uploadNotes.array("notesFiles"), createLesson);

// =========================
// ADD VIDEO TO LESSON
// =========================
router.post("/:lessonId/videos", adminAuth, addVideoToLesson);

// =========================
// ADD NOTE TO LESSON
// =========================
router.post(
  "/:lessonId/notes",
  adminAuth,
  uploadNotes.array("notesFiles"),
  addNoteToLesson
);

// =========================
// DELETE VIDEO FROM LESSON
// =========================
router.delete("/:lessonId/videos", adminAuth, deleteVideo);

// =========================
// DELETE NOTE FROM LESSON
// =========================
router.delete("/:lessonId/notes", adminAuth, deleteNote);

// =========================
// DELETE ENTIRE LESSON
// =========================
router.delete("/:lessonId", adminAuth, deleteLesson);

export const adminLessons = router;
