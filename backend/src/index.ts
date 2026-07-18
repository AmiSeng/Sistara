import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
//Routes
import auth from "./routes/auth";
import adminAuthRoutes from "./routes/adminAuth";
import adminProfileRoutes from "./routes/adminProfile";
import { adminLessons } from "./routes/adminLessons";
import adminStudent from "./routes/adminStudent";
import adminCourses from "./routes/adminCourses";
import studentRoutes from "./routes/student";
import adminDashboard from "./routes/adminDashboard";
import adminCurriculum from "./routes/adminCurriculum";
//middleware
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://sistara.vercel.app"],
    credentials: true
  })
);
app.use(express.json());

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "Sistara API running"
  });
});

//Routes
// Admin routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminProfileRoutes);
app.use("/api/admin/lessons", adminLessons);
app.use("/api/admin/students", adminStudent);
app.use("/api/admin/courses", adminCourses);
app.use("/api/admin/dashboard", adminDashboard);
app.use("/api/admin/curriculum", adminCurriculum);

// Student routes
app.use("/api", auth);
app.use("/api/student", studentRoutes);
// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
