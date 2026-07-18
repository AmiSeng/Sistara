import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth";
import { getCurriculum } from "../controllers/adminCurriculumController";

const router = Router();

router.get("/", adminAuth, getCurriculum);

export default router;
