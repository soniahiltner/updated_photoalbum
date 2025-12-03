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
  console.log('🚀 uploadImages middleware called')
  console.log('📋 Content-Type:', req.headers['content-type'])

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
    console.log('✅ Multer finished processing')

    if (err) {
      console.error('❌ Multer error:', err)
      console.error('❌ Error stack:', err.stack)
      console.error('❌ Error details:', JSON.stringify(err, null, 2))
      return next(err)
    }

    console.log('📁 Files after multer:', req.files)
    console.log(
      '📊 Number of files processed:',
      (req.files as any[])?.length || 0
    )
    next()
  })
}
