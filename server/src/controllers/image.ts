import type { Request, Response } from 'express'
import { ImageService } from '../services/image.js'
import { uploadImages } from '../middleware/multer.js'

class ImageController {
  // Get images
  static async getImages(req: Request, res: Response) {
    const queryPage = parseInt(req.query.page as string) || 1
    const queryFavPage = parseInt(req.query.favpage as string) || 1
    const isFavourite = req.query.favourite === 'true'

    try {
      if (isFavourite) {
        const { images, page, totalPages, count } =
          await ImageService.getFavouriteImages(queryFavPage)
        return res.status(200).json({ images, page, totalPages, count })
      } else {
        const { images, page, totalPages, count } =
          await ImageService.getImages(queryPage)
        return res.status(200).json({ images, page, totalPages, count })
      }
    } catch (error) {
      res.status(500).json({
        error: 'Error trying to get images',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Get album images
  static async getAlbumImages(req: Request, res: Response) {
    const albumName = req.params.albumname
    const isLast = req.query.last === 'true'
    const queryPage = parseInt(req.query.page as string) || 1

    if (!albumName) {
      return res.status(400).json({ error: 'Album name is required' })
    }

    try {
      if (isLast) {
        const image = await ImageService.getAlbumLastImage(albumName)
        return res.status(200).json(image)
      } else {
        const { images, page, totalPages, count } =
          await ImageService.getAlbumImages(albumName, queryPage)
        return res.status(200).json({ images, page, totalPages, count })
      }
    } catch (error) {
      res.status(500).json({
        error: 'Error trying to get album images',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Create image
  static async createImage(req: Request, res: Response) {
    uploadImages(req, res, async function (err) {
      if (err instanceof Error) {
        return res.status(500).json({ error: err.message })
      } else if (err) {
        return res
          .status(500)
          .json({ error: 'Unknown error during file upload' })
      }
      try {
        const files = req.files as Express.Multer.File[]
        files.forEach(async (file) => {
          await ImageService.createImage(file)
        })
        const images = await ImageService.getImages(1)
        return res.status(201).json(images)
      } catch (error) {
        res.status(500).json({
          error: 'Error trying to create image',
          details: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    })
  }

  // Delete image
  static async deleteImage(req: Request, res: Response) {
    const id = req.params.id?.toString()
    if (!id) {
      return res.status(400).json({ error: 'Image ID is required' })
    }
    try {
      await ImageService.deleteImage(id)
      return res.status(200).json({ message: 'Image deleted successfully' })
    } catch (error) {
      res.status(500).json({
        error: 'Error trying to delete image',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Update image- favourite
  static async updateImageFavourite(req: Request, res: Response) {
    const id = req.params.id?.toString()
    const { isFavourite } = req.body
    if (!id) {
      return res.status(400).json({ error: 'Image ID is required' })
    }
    try {
      const { images, favCount } = await ImageService.updateImageFavourite(
        id,
        isFavourite
      )
      return res.status(200).json({ images, favCount })
    } catch (error) {
      res.status(500).json({
        error: 'Error trying to update image favourite status',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Update image-albums
  static async updateImageAlbums(req: Request, res: Response) {
    const id = req.params.id?.toString()
    const albums = (req.body.albums as string[]) || null
    const albumName = (req.body.albumName as string) || ''
    if (!id) {
      return res.status(400).json({ error: 'Image ID is required' })
    }
    try {
      if (albums) {
        await ImageService.addImageToAlbum(id, albums)
        return res
          .status(200)
          .json({ message: 'Image added to album successfully' })
      }
      if (albumName) {
        const image = await ImageService.removeImageFromAlbum(id, albumName)
        return res.status(200).json(image)
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Error trying to update image albums',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Update image-albums
  // Add image to an album
  static async addImageToAlbum(req: Request, res: Response) {
    const id = req.params.id?.toString()
    const { albums } = req.body
    if (!id) {
      return res.status(400).json({ error: 'Image ID is required' })
    }
    try {
      await ImageService.addImageToAlbum(id, albums)
      return res
        .status(200)
        .json({ message: 'Image added to album successfully' })
    } catch (error) {
      res.status(500).json({
        error: 'Error trying to add image to album',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Update image-albums
  // Remove image from an album
  static async removeImageFromAlbum(req: Request, res: Response) {
    const id = req.params.id?.toString()
    const albumName = req.params.albumName
    if (!id) {
      return res.status(400).json({ error: 'Image ID is required' })
    }
    if (!albumName) {
      return res.status(400).json({ error: 'Album name is required' })
    }
    try {
      const image = await ImageService.removeImageFromAlbum(id, albumName)
      return res.status(200).json(image)
    } catch (error) {
      res.status(500).json({
        error: 'Error trying to remove image from album',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

export const {
  getImages,
  getAlbumImages,
  createImage,
  deleteImage,
  updateImageFavourite,
  addImageToAlbum,
  removeImageFromAlbum,
  updateImageAlbums
} = ImageController
