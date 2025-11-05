import multer from "multer"
import { storage } from '../libs/cloudinary.js'

const upload = multer({ storage: storage })

// Middleware para manejar la subida de imágenes
const maxFiles = 3
export const uploadImages = upload.array('images', maxFiles)