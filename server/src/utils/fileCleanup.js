import fs from "fs";
import path from "path";

export const deleteFile = (filePath) => {
  if (!filePath) return;

  try {
    // remove leading slash if present
    const cleanPath = filePath.startsWith("/")
      ? filePath.slice(1)
      : filePath;

    const fullPath = path.join(process.cwd(), cleanPath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log("🗑 Deleted file:", cleanPath);
    } else {
      console.log("⚠ File not found:", cleanPath);
    }
  } catch (err) {
    console.error("❌ File delete error:", err.message);
  }
};