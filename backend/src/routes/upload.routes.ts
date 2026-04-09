import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth";
import { uploadImageBuffer } from "../services/upload.service";
import { Errors } from "../utils/error";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

/**
 * POST /api/upload
 * Requires auth. Expects a multipart form with 'file' field.
 */
router.post("/", authMiddleware, upload.single("file"), async (req, res, next) => {
  try {
    const file = (req as any).file;
    if (!file) {
      throw Errors.INVALID_INPUT("No file uploaded");
    }

    const folder = req.body.folder || "hazina_users";
    const url = await uploadImageBuffer(file.buffer, folder);

    res.json({ url });
  } catch (error) {
    next(error);
  }
});

export default router;
