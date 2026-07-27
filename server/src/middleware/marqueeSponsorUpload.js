import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(
    process.cwd(),
    "uploads", "marquee-sponsors"
);

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {
        recursive: true
    });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },

  filename(req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});
 

const fileFilter = (req,file, cb)=>{
    const allowed = [
       "image/jpeg",
        "image/png",
        "image/webp",
        "image/svg+xml"
    ];

    if(allowed.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(
            new Error("Only JPG, PNG, WEBP and SVG images are allowed"),
            false
        );
    }
};

export const marqueeSponsorUpload = multer({
    storage, 
    fileFilter,
    limits:{
        fileSize: 2 * 1024 * 1024
    }
});