import express from "express";
import cors from "cors";
import auth from "./routes/auth";
import dotenv from "dotenv";
import adminAuthRoutes from "./routes/adminAuth";
import adminProfileRoutes from "./routes/adminProfile";
import { adminLessons } from "./routes/adminLessons";
dotenv.config();
import path from "path";
import adminStudent from "./routes/adminStudent";
import adminCourses from "./routes/adminCourses";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // frontend origin
    credentials: true // allow cookies/auth headers
  })
);
app.use(express.json());

// Admin routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminProfileRoutes);
app.use("/api/admin/lessons", adminLessons);
app.use("/api/admin/students", adminStudent);
app.use("/api/admin/courses", adminCourses);

// Student routes
app.use("/api", auth);

// serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
