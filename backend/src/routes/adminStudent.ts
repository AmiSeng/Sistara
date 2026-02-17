// routes/adminStudent.ts
import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth";
import {
  getStudents,
  createStudent,
  updateStudent,
  disableStudent,
  toggleSubscription
} from "../controllers/adminStudentController";

const router = Router();

router.get("/", adminAuth, getStudents);
router.post("/", adminAuth, createStudent);
router.put("/:id", adminAuth, updateStudent);
router.patch("/:id/disable", adminAuth, disableStudent);
router.patch("/subscriptions/:userId", toggleSubscription);

export default router;
