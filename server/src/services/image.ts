import { Image } from '../models/image.js'
import { cloudinary } from '../libs/cloudinary.js'

class ImageService {
  // Get images
  static async getImages(page: number) {
    const limit = 10
    const skip = (page - 1) * limit
    try {
      const count = await Image.countDocuments()
      const totalPages = Math.ceil(count / limit)
      const images = await Image.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec()
      return { images, page, totalPages, count }
    } catch (error) {
      console.error('Error fetching images:', error)
      throw new Error('Could not fetch images')
    }
  }

  // Get favourites images
  static async getFavouriteImages(page: number) {
    const limit = 10
    const skip = (page - 1) * limit

    try {
      const count = await Image.countDocuments({ isFavourite: true })
      const totalPages = Math.ceil(count / limit)
      const images = await Image.find({ isFavourite: true })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec()
      return { images, page, totalPages, count }
    } catch (error) {
      console.error('Error fetching favourite images:', error)
      throw new Error('Could not fetch favourite images')
    }
  }

  // Get album images
  static async getAlbumImages(albumName: string, page: number) {
    const limit = 10
    const skip = (page - 1) * limit
    try {
      const count = await Image.countDocuments({ albums: { $in: [albumName] } })
      const totalPages = Math.ceil(count / limit)
      const images = await Image.find({ albums: { $in: [albumName] } })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec()
      return { images, page, totalPages, count }
    } catch (error) {
      console.error('Error fetching album images:', error)
      throw new Error('Could not fetch album images')
    }
  }

  // // Get album last-image
  static async getAlbumLastImage(albumName: string) {
    try {
      const image = await Image.findOne({ albums: { $in: [albumName] } })
        .sort({ _id: -1 })
        .limit(1)
        .exec()
      return image
    } catch (error) {
      console.error('Error fetching album last image:', error)
      throw new Error('Could not fetch album last image')
    }
  }

  // Create image
  static async createImage(
    file: Express.Multer.File & { public_id?: string; secure_url?: string }
  ) {
    try {
      const image = await Image.create({
        filename: file.public_id || file.filename,
        url: file.secure_url || file.path
      })
      return image
    } catch (error) {
      console.error('Error creating image:', error)
      throw new Error('Could not create image')
    }
  }

  // Delete image
  static async deleteImage(id: string) {
    try {
      const image = await Image.findById(id)
      const imagePublicId = image?.filename
      if (imagePublicId) {
        await cloudinary.uploader.destroy(imagePublicId)
      }
      await Image.deleteOne({ _id: id })
    } catch (error) {
      console.error('Error deleting image:', error)
      throw new Error('Could not delete image')
    }
  }

  // Update image- favourite
  static async updateImageFavourite(id: string, isFavourite: boolean) {
    try {
      const image = await Image.findByIdAndUpdate(
        id,
        { isFavourite },
        { new: true }
      )
      const images = await Image.find()
      const favCount = await Image.countDocuments({ isFavourite: true })
      return { images, favCount }
    } catch (error) {
      console.error('Error updating image favourite status:', error)
      throw new Error('Could not update image favourite status')
    }
  }

  // Update image-albums
  // Add image to an album
  static async addImageToAlbum(id: string, albumsArray: string[]) {
    try {
      const image = await Image.findOneAndUpdate(
        { _id: id },
        { $addToSet: { albums: { $each: albumsArray } } },
        { new: true }
      )
      if (!image) {
        throw new Error('Image not found')
      }
      return image
    } catch (error) {
      console.error('Error adding image to album:', error)
      throw new Error('Could not add image to album')
    }
  }

  // Update image-albums
  // Remove image from an album
  static async removeImageFromAlbum(id: string, albumName: string) {
    try {
      const image = await Image.findOneAndUpdate(
        { _id: id },
        { $pull: { albums: { $in: [`${albumName}`] } } },
        { new: true }
      )
      if (!image) {
        throw new Error('Image not found')
      }
      return image
    } catch (error) {
      console.error('Error removing image from album:', error)
      throw new Error('Could not remove image from album')
    }
  }
}

export { ImageService }
