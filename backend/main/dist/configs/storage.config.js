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
};
export const uploadFile = async (bucket, objectName, fileBuffer, mimeType) => {
    try {
        await minioClient.putObject(bucket, objectName, fileBuffer, fileBuffer.length, {
            'Content-Type': mimeType,
        });
        // Creating direct link for an image. For browser link should be localhost and not minio.
        const publicHost = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';
        return `${bucket}/${objectName}`;
    }
    catch (error) {
        console.error(`[MinIO Error] Error while loading an image ${objectName} into the ${bucket}:`, error);
        throw new Error('Failed to upload file to storage');
    }
};
export const getPublicUrl = (imagePath) => {
    const publicHost = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';
    return `${publicHost}/${imagePath}`;
};
export const parseJsonField = (fieldName) => {
    return (req, res, next) => {
        if (req.body && typeof req.body[fieldName] === 'string') {
            try {
                req.body[fieldName] = JSON.parse(req.body[fieldName]);
            }
            catch (error) {
                return res.status(400).json({
                    message: `Error: Invalid JSON format in field "${fieldName}"`
                });
            }
        }
        next();
    };
};
const storage = multer.memoryStorage(); // RAM-storage.
// Validation.
const fileFilter = (req, file, callback) => {
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
