import multer from "multer";
import path from "path";
import fs from "fs";

// absolute uploads directory
const uploadPath = path.resolve(__dirname, "../../uploads/notes");

// ensure directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "");
    cb(null, uniqueName);
  },
});

// allow only PDFs
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed"));
  }
};

const uploadNotes = multer({
  storage,
  fileFilter,
});

export { uploadNotes };
