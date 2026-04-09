"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageBuffer = void 0;
const cloudinary_1 = require("cloudinary");
// Ensure cloudinary is configured if env vars exist
if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}
/**
 * Uploads a buffer directly to Cloudinary.
 * Ideal for use with multer memory storage.
 */
const uploadImageBuffer = (buffer, folder = "hazina") => {
    return new Promise((resolve, reject) => {
        // If not configured, just return a dummy URL for local dev without errors
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            console.warn("Cloudinary not configured. Returning dummy URL.");
            return resolve("https://via.placeholder.com/150");
        }
        const stream = cloudinary_1.v2.uploader.upload_stream({ folder, resource_type: "auto" }, (error, result) => {
            if (error)
                return reject(error);
            if (!result)
                return reject(new Error("Cloudinary result is undefined"));
            resolve(result.secure_url);
        });
        stream.end(buffer);
    });
};
exports.uploadImageBuffer = uploadImageBuffer;
