import express from "express";
import cors from "cors";
import auth from "./routes/auth";
import dotenv from "dotenv";
import adminAuthRoutes from "./routes/adminAuth";
import adminProfileRoutes from "./routes/adminProfile";
import adminStudents from "./routes/adminStudents";
import adminSubscription from "./routes/adminSubscription";
import { adminCoursesRouter } from "./routes/adminCourses";
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Admin routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminProfileRoutes);
app.use("/api/admin/students", adminStudents);
app.use("/api/admin/subscriptions", adminSubscription);
app.use("/api/admin/courses", adminCoursesRouter);

// Student routes
app.use("/api", auth);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
