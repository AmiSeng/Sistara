import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth";
import { getCourses } from "../controllers/adminCoursesController";

const router = Router();

// GET all courses with phases
router.get("/", adminAuth, getCourses);

export default router;
