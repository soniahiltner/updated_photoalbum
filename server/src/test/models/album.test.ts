import { describe, it, expect, beforeEach } from 'vitest'
import { Album } from '../../models/album.js'

describe('Album Model', () => {
  beforeEach(async () => {
    // Limpiar la colección antes de cada test
    await Album.deleteMany({})
  })

  describe('Validation', () => {
    it('should create a valid album', async () => {
      const albumData = {
        name: 'vacation photos'
      }

      const album = new Album(albumData)
      const savedAlbum = await album.save()

      expect(savedAlbum.name).toBe('vacation photos')
      expect(savedAlbum._id).toBeDefined()
    })

    it('should require album name', async () => {
      const album = new Album({})

      await expect(album.save()).rejects.toThrow('Album must have a name')
    })

    it('should enforce minimum length', async () => {
      const album = new Album({ name: 'ab' })

      await expect(album.save()).rejects.toThrow(
        'Album name must have at least 3 characters'
      )
    })

    it('should enforce maximum length', async () => {
      const album = new Album({ name: 'a'.repeat(21) })

      await expect(album.save()).rejects.toThrow(
        'Album name must have at most 20 characters'
      )
    })

    it('should convert name to lowercase', async () => {
      const album = new Album({ name: 'VACATION PHOTOS' })
      const savedAlbum = await album.save()

      expect(savedAlbum.name).toBe('vacation photos')
    })

    it('should trim whitespace', async () => {
      const album = new Album({ name: '  vacation photos  ' })
      const savedAlbum = await album.save()

      expect(savedAlbum.name).toBe('vacation photos')
    })

    it('should enforce unique album names', async () => {
      // Crear primer álbum
      const album1 = new Album({ name: 'vacation photos' })
      await album1.save()

      // Intentar crear segundo álbum con el mismo nombre
      const album2 = new Album({ name: 'vacation photos' })

      await expect(album2.save()).rejects.toThrow()
    })
  })

  describe('CRUD Operations', () => {
    it('should find album by id', async () => {
      const album = new Album({ name: 'test album' })
      const savedAlbum = await album.save()

      const foundAlbum = await Album.findById(savedAlbum._id)
      expect(foundAlbum).toBeTruthy()
      expect(foundAlbum?.name).toBe('test album')
    })

    it('should update album', async () => {
      const album = new Album({ name: 'old name' })
      const savedAlbum = await album.save()

      const updatedAlbum = await Album.findByIdAndUpdate(
        savedAlbum._id,
        { name: 'new name' },
        { new: true }
      )

      expect(updatedAlbum?.name).toBe('new name')
    })

    it('should delete album', async () => {
      const album = new Album({ name: 'to be deleted' })
      const savedAlbum = await album.save()

      await Album.findByIdAndDelete(savedAlbum._id)

      const deletedAlbum = await Album.findById(savedAlbum._id)
      expect(deletedAlbum).toBeNull()
    })

    it('should find all albums', async () => {
      await Album.create([
        { name: 'album 1' },
        { name: 'album 2' },
        { name: 'album 3' }
      ])

      const albums = await Album.find({})
      expect(albums).toHaveLength(3)
    })
  })
})
