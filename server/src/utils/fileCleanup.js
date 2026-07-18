// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // root uploads folder
// const UPLOAD_ROOT = path.join(__dirname, "..", "..", "uploads");

// export const deleteFile = (filePath) => {
//   if (!filePath) return;

//   try {
//     const fullPath = path.join(process.cwd(), filePath);

//     if (fs.existsSync(fullPath)) {
//       fs.unlinkSync(fullPath);
//       console.log("🗑 Deleted file:", filePath);
//     }
//   } catch (err) {
//     console.error("❌ File delete error:", err.message);
//   }
// };

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