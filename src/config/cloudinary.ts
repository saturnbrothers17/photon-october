import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage for study materials (PDFs, docs)
export const materialStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'photon/study-materials',
        allowed_formats: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'],
        resource_type: 'raw' as any
    } as any
});

// Storage for question diagrams (images)
export const diagramStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'photon/diagrams',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
        transformation: [{ width: 1000, crop: 'limit', quality: 'auto' }]
    } as any
});

// Storage for AI extractor images
export const extractorStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'photon/ai-extracts',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 2000, crop: 'limit', quality: 'auto' }]
    } as any
});

// Multer upload instances
export const uploadMaterial = multer({ 
    storage: materialStorage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export const uploadDiagram = multer({ 
    storage: diagramStorage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadExtractor = multer({ 
    storage: extractorStorage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default cloudinary;
