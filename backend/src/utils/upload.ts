import multer from "multer";

// Store file temporarily in memory
const storage = multer.memoryStorage();

// Only allow PDF files
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

export const uploadNotes = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});
