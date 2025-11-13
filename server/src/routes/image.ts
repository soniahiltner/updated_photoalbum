import { Router } from "express"
import { createImage, deleteImage, getAlbumImages,  getImages, updateImageAlbums, updateImageFavourite } from "../controllers/image.js"

const router = Router()

router.get('/', getImages)
router.get('/:albumname', getAlbumImages)
router.post('/', createImage)
router.delete('/:id', deleteImage)
router.put('/:id', updateImageFavourite)
router.put('/:id/albums', updateImageAlbums)

export default router