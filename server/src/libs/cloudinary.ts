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
    resource_type: 'auto',
    transformation: [
      {
        width: 2000,
        height: 2000,
        crop: 'limit',
        quality: 'auto',
        fetch_format: 'auto'
      }
    ]
  } as any
})

/**
 * Tipos para las transformaciones de Cloudinary
 */
export type ImageSize = 'thumbnail' | 'medium' | 'original' | 'blur'

export interface OptimizedImageUrls {
  thumbnail: string
  medium: string
  original: string
  blur: string
}

/**
 * Genera URLs optimizadas de imágenes usando transformaciones de Cloudinary
 * @param url - URL original de Cloudinary
 * @param size - Tamaño deseado de la imagen
 * @returns URL transformada con optimizaciones de Cloudinary
 */
export function getOptimizedImageUrl(url: string, size: ImageSize): string {
  // Si la URL no es de Cloudinary, devolverla sin cambios
  if (!url.includes('cloudinary.com')) {
    return url
  }

  // Definir transformaciones según el tamaño
  const transformations: Record<ImageSize, string> = {
    thumbnail: 'f_auto,q_auto:good,w_400,h_400,c_fill',
    medium: 'f_auto,q_auto:good,w_800,h_800,c_limit',
    original: 'f_auto,q_auto:eco',
    blur: 'f_auto,q_1,w_50,h_50,e_blur:1000,c_fill'
  }

  const transformation = transformations[size]

  // Buscar el patrón /upload/ y lo que viene después
  const uploadPattern = /\/upload\//
  if (!uploadPattern.test(url)) {
    return url
  }

  // Dividir en la parte antes y después de /upload/
  const parts = url.split('/upload/')
  if (parts.length !== 2) {
    return url
  }

  const baseUrl = parts[0]
  const afterUpload = parts[1]

  if (!afterUpload) {
    return url
  }

  // Detectar si ya tiene transformaciones (formato: transform1,transform2/resto)
  // o si tiene versión directamente (formato: v123456/folder/file)
  const afterUploadParts = afterUpload.split('/')
  
  // Si el primer segmento después de /upload/ NO empieza con 'v' (versión),
  // asumimos que son transformaciones existentes y las saltamos
  let pathWithoutTransformations = afterUpload
  if (afterUploadParts[0] && !afterUploadParts[0].startsWith('v')) {
    // Tiene transformaciones, tomar desde el segundo segmento en adelante
    pathWithoutTransformations = afterUploadParts.slice(1).join('/')
  }

  // Construir URL con nuestras transformaciones
  return `${baseUrl}/upload/${transformation}/${pathWithoutTransformations}`
}

/**
 * Genera todas las versiones optimizadas de una imagen
 * @param originalUrl - URL original de Cloudinary
 * @returns Objeto con todas las URLs optimizadas
 */
export function getAllOptimizedUrls(originalUrl: string): OptimizedImageUrls {
  return {
    thumbnail: getOptimizedImageUrl(originalUrl, 'thumbnail'),
    medium: getOptimizedImageUrl(originalUrl, 'medium'),
    original: getOptimizedImageUrl(originalUrl, 'original'),
    blur: getOptimizedImageUrl(originalUrl, 'blur')
  }
}

// Exportar cloudinary y storage para usar en otros módulos
export { cloudinary, storage }
