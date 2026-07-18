import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth";
import { getDashboardMetrics } from "../controllers/adminDashboardController";

const router = Router();

router.get("/", adminAuth, getDashboardMetrics);

export default router;
