import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

// Interface personalizada para los parámetros de Cloudinary
interface CloudinaryParams {
  folder: string
  allowed_formats: string[]
  [key: string]: any
}

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true
})
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'my_images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'tiff']
  } as CloudinaryParams
})

// Exportar cloudinary y storage para usar en otros módulos
export { cloudinary, storage }
