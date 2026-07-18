import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(
    process.cwd(),
    "uploads", "carousel"
);

//Create folder if not exists
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{
        recursive: true
    });
}

const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null,uploadDir);
    },

    filename(req,file,cb){
        const ext = path.extname(file.originalname);

        const filename = `carousel-${Date.now()}${ext}`;

        cb(null, filename);
    }
});

const fileFilter=(req,file,cb)=>{
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if(!allowedTypes.includes(file.mimetype)){
        return cb(
            new Error("Only jpg, png and webp images are allowed")
        );
    }
    cb(null, true);
};

export default multer({
    storage, 
    fileFilter,
    limits:{
        fieldSize: 5 * 1024 * 1024
    },
});