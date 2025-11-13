import type { Request, Response } from 'express'
import { AlbumService } from '../services/album.js'

class AlbumController {
  // Get albums
  static async getAlbums(req: Request, res: Response) {
    try {
      const albums = await AlbumService.getAlbums()
      return res.status(200).json(albums)
    } catch (error) {
      res.status(500).json({
        error: 'Error trying to get albums',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Create album
  static async createAlbum(req: Request, res: Response) {
    const { name } = req.body
    try {
      const album = await AlbumService.createAlbum(name)
      return res.status(201).json(album)
    } catch (error) {
      res.status(500).json({
        error: 'Error trying to create album',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Delete album
  static async deleteAlbum(req: Request, res: Response) {
    const { name } = req.params
    try {
      if (!name) {
        return res.status(400).json({ error: 'Album name is required' })
      }
      await AlbumService.deleteAlbum(name)
      return res.status(200).json({ message: 'Album deleted successfully' })
    } catch (error) {
      res.status(500).json({
        error: 'Error trying to delete album',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

export const { getAlbums, createAlbum, deleteAlbum } = AlbumController
