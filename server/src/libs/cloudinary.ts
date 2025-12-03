import cloudinaryModule from 'cloudinary'
import CloudinaryStorage from 'multer-storage-cloudinary'
import dotenv from 'dotenv'

dotenv.config()

// Usar v2 para la API pero pasar el módulo completo a CloudinaryStorage
const cloudinary = cloudinaryModule.v2

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

// Verificar que las credenciales estén configuradas
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error(
    '❌ Error: Cloudinary credentials are missing in environment variables'
  )
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryModule as any,
  params: {
    folder: 'my_images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'tiff'],
    resource_type: 'auto'
  } as any
})

// Exportar cloudinary y storage para usar en otros módulos
export { cloudinary, storage }
