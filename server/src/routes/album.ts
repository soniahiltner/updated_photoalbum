import { Router } from "express"
import { createAlbum, deleteAlbum, getAlbums } from "../controllers/album.js"

const router = Router()

router.get('/', getAlbums)
router.post('/', createAlbum)
router.delete('/:name', deleteAlbum)

export default router