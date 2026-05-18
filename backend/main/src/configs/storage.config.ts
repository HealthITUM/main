import multer from 'multer';
import path from 'path';
import * as Minio from 'minio';

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'minio',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  useSSL: process.env.MINIO_USE_SSL === 'true', // dev = false
  accessKey: process.env.MINIO_ROOT_USER || 'admin',
  secretKey: process.env.MINIO_ROOT_PASSWORD || 'password',
});

export const BUCKETS = {
  PLANTS: process.env.S3_BUCKET_PLANTS || 'plants',
  RECIPES: process.env.S3_BUCKET_RECIPES || 'recipes',
  SPECIES: process.env.S3_BUCKET_SPECIES || 'species',
} as const;

export const uploadFile = async (
  bucket: typeof BUCKETS[keyof typeof BUCKETS],
  objectName: string,
  fileBuffer: Buffer,
  mimeType: string
): Promise<string> => {
  try {
    await minioClient.putObject(bucket, objectName, fileBuffer, fileBuffer.length, {
      'Content-Type': mimeType,
    });

    // Creating direct link for an image. For browser link should be localhost and not minio.
    const publicHost = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';
    return `${publicHost}/${bucket}/${objectName}`;
  } catch (error) {
    console.error(`[MinIO Error] Error while loading an image ${objectName} into the ${bucket}:`, error);
    throw new Error('Failed to upload file to storage');
  }
};

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