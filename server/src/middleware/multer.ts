import multer from 'multer'
import { storage } from '../libs/cloudinary.js'

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

// Middleware para manejar la subida de imágenes
const maxFiles = 3

// Crear un wrapper que agregue logs
const uploadMiddleware = upload.array('file', maxFiles)

export const uploadImages = (req: any, res: any, next: any) => {

  // Timeout de 30 segundos
  const timeout = setTimeout(() => {
    console.error('⏱️ TIMEOUT: Multer/Cloudinary no respondió en 30 segundos')
    if (!res.headersSent) {
      res
        .status(408)
        .json({ error: 'Upload timeout - Cloudinary no respondió' })
    }
  }, 30000)

  uploadMiddleware(req, res, (err: any) => {
    clearTimeout(timeout)

    if (err) {
      console.error('❌ Multer error:', err)
      console.error('❌ Error stack:', err.stack)
      console.error('❌ Error details:', JSON.stringify(err, null, 2))
      return next(err)
    }

    next()
  })
}
