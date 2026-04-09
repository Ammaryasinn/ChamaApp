"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const upload_service_1 = require("../services/upload.service");
const error_1 = require("../utils/error");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
/**
 * POST /api/upload
 * Requires auth. Expects a multipart form with 'file' field.
 */
router.post("/", auth_1.authMiddleware, upload.single("file"), async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            throw error_1.Errors.INVALID_INPUT("No file uploaded");
        }
        const folder = req.body.folder || "hazina_users";
        const url = await (0, upload_service_1.uploadImageBuffer)(file.buffer, folder);
        res.json({ url });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
