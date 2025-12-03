import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import {
  createImage,
  deleteImage,
  getAlbumImages,
  getImages,
  updateImageAlbums,
  updateImageFavourite
} from '../controllers/image.js'
import { uploadImages } from '../middleware/multer.js'

const router = Router()

// Middleware para manejar errores de multer
const handleMulterError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Multer error in route:', err)
  if (err) {
    return res.status(400).json({
      error: 'Error uploading files',
      details: err.message
    })
  }
  next()
}

router.get('/', getImages)
router.get('/:albumname', getAlbumImages)
router.post('/', uploadImages, handleMulterError, createImage)
router.patch('/:id/favourite', updateImageFavourite)
router.patch('/:id/albums', updateImageAlbums)
router.delete('/:id', deleteImage)

export default router
