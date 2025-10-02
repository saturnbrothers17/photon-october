"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadExtractor = exports.uploadDiagram = exports.uploadMaterial = exports.extractorStorage = exports.diagramStorage = exports.materialStorage = void 0;
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// Storage for study materials (PDFs, docs)
exports.materialStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'photon/study-materials',
        allowed_formats: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'],
        resource_type: 'raw'
    }
});
// Storage for question diagrams (images)
exports.diagramStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'photon/diagrams',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
        transformation: [{ width: 1000, crop: 'limit', quality: 'auto' }]
    }
});
// Storage for AI extractor images
exports.extractorStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'photon/ai-extracts',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 2000, crop: 'limit', quality: 'auto' }]
    }
});
// Multer upload instances
exports.uploadMaterial = (0, multer_1.default)({
    storage: exports.materialStorage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
exports.uploadDiagram = (0, multer_1.default)({
    storage: exports.diagramStorage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
exports.uploadExtractor = (0, multer_1.default)({
    storage: exports.extractorStorage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
exports.default = cloudinary_1.v2;
