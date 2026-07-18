// export const errorHandler = (err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({
//     message: "Internal Server Error",
//     error: err.message,
//   });
// };

import multer from "multer";

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};