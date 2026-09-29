import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith("image/")
      ? cb(null, true)
      : cb(new Error("Only image files are allowed")),
});

// turn multer errors into 400s instead of 500s
const handleUpload = (req, res, next) =>
  upload.single("image")(req, res, (err) => {
    if (err) {
      res.status(400);
      return next(err);
    }
    next();
  });

router.post("/", protect, handleUpload, (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: "No image provided" });

  const stream = cloudinary.uploader.upload_stream(
    { folder: "research-academic/services", resource_type: "image" },
    (err, result) => {
      if (err) return next(err);
      res
        .status(201)
        .json({ url: result.secure_url, publicId: result.public_id });
    },
  );
  stream.end(req.file.buffer);
});

export default router;
