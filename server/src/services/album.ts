import { Image } from "../models/image.js"
import { Album } from "../models/album.js"

class AlbumService {
  // Get all albums
  static async getAlbums() {
    try {
      const albums = await Album.find().exec()
      return albums
    } catch (error) {
      console.error('Error fetching albums:', error)
      throw new Error('Could not fetch albums')
    }
  }

  // Create a new album
  static async createAlbum(name: string) {
    try {
      const album = await Album.create({ name })
      return album
    } catch (error) {
      console.error('Error creating album:', error)
      throw new Error('Could not create album')
    }
  }

  // Delete an album
  static async deleteAlbum(name: string) {
    try {
      const result = await Album.deleteOne({ name })
      console.log(result)
      // update images to remove the deleted album from their albums array
      await Image.updateMany({}, { $pull: { albums: { $in: [`${name}`] } } })
    } catch (error) {
      console.error('Error deleting album:', error)
      throw new Error('Could not delete album')
    }
  }
}

export { AlbumService }