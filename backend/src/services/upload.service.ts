import { v2 as cloudinary } from "cloudinary";

// Ensure cloudinary is configured if env vars exist
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Uploads a buffer directly to Cloudinary.
 * Ideal for use with multer memory storage.
 */
export const uploadImageBuffer = (
  buffer: Buffer,
  folder: string = "hazina"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If not configured, just return a dummy URL for local dev without errors
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.warn("Cloudinary not configured. Returning dummy URL.");
      return resolve("https://via.placeholder.com/150");
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary result is undefined"));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};
