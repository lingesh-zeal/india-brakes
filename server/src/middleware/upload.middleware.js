import multer from "multer";
import fs from "fs";
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_ROOT = path.join(__dirname, "..", "..", "uploads");

//create storage dynamically
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = "events";

    switch (file.fieldname) {
      case "banner":
        folder = "banners";
        break;
      case "photos":
        folder = "events";
        break;
      case "speaker_images":
        folder = "speakers";
        break;
      case "sponsor_logos":
        folder = "sponsors";
        break;
      case "brochure": 
         folder = "brochures";
         break;
    }

      const dir = path.join(UPLOAD_ROOT, folder);
      fs.mkdirSync(dir, { recursive: true });

      console.log(`📁 ${file.fieldname} → ${folder}`);

      cb(null, dir);
    },

    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname);

      cb(null, uniqueName);
    },
  });

const fileFilter = (req, file, cb) =>{
    const allowedImages = [
        "image/jpeg", "image/png", "image/webp"
    ];

    const allowedDocs = [
        "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if([...allowedImages, ...allowedDocs].includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(new Error("Only images, PDF, DOC, DOCX allowed"))
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 25 * 1024 * 1024 }
})

export default upload
