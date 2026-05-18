import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage(); // RAM-storage.

// Validation.
const fileFilter = (req: any, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  const allowedExtensions = /jpeg|jpg|png|webp/;
  
  // Extension and mime-type.
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedExtensions.test(file.mimetype);

  if (extname && mimetype) {
    return callback(null, true);
  }
  
  callback(new Error('Invalid format. Allowed: jpeg, jpg, png, webp.'));
};

export const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit - 5 MB per file.
  },
  fileFilter: fileFilter,
}).single('image');