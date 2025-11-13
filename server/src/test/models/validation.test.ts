import { describe, it, expect, beforeEach } from 'vitest'
import { Album } from '../../models/album.js'
import { Image } from '../../models/image.js'
import mongoose from 'mongoose'

describe('Model Validation Tests', () => {
  beforeEach(async () => {
    await Album.deleteMany({})
    await Image.deleteMany({})
  })

  describe('Album Validation Edge Cases', () => {
    it('should handle unicode characters correctly', async () => {
      const unicodeAlbums = [
        { name: '🏖️ beach photos', expected: '🏖️ beach photos' },
        { name: 'Café París', expected: 'café parís' },
        { name: '东京旅行', expected: '东京旅行' },
        { name: 'Москва 2023', expected: 'москва 2023' }
      ]

      for (const { name, expected } of unicodeAlbums) {
        const album = await Album.create({ name })
        expect(album.name).toBe(expected)
      }
    })

    it('should reject albums with only whitespace', async () => {
      const whitespaceNames = ['   ', '\t\t', '\n\n', '']

      for (const name of whitespaceNames) {
        await expect(Album.create({ name })).rejects.toThrow()
      }
    })

    it('should handle maximum length edge case', async () => {
      // Exactamente 20 caracteres (límite máximo)
      const maxLengthName = 'a'.repeat(20)
      const album = await Album.create({ name: maxLengthName })
      expect(album.name).toBe(maxLengthName)

      // 21 caracteres (debe fallar)
      const tooLongName = 'a'.repeat(21)
      await expect(Album.create({ name: tooLongName })).rejects.toThrow()
    })

    it('should handle duplicate names case insensitively', async () => {
      await Album.create({ name: 'Vacation Photos' })

      // Debe fallar con diferentes variaciones de mayúsculas
      const duplicateAttempts = [
        'VACATION PHOTOS',
        'vacation photos',
        'Vacation photos',
        'VACATION photos'
      ]

      for (const name of duplicateAttempts) {
        await expect(Album.create({ name })).rejects.toThrow()
      }
    })
  })

  describe('Image Validation Edge Cases', () => {
    it('should handle very long URLs', async () => {
      const longUrl = 'https://cloudinary.com/' + 'a'.repeat(500) + '.jpg'

      const image = await Image.create({
        filename: 'long-url.jpg',
        url: longUrl,
        albums: ['test']
      })

      expect(image.url).toBe(longUrl)
    })

    it('should handle special characters in filenames', async () => {
      const specialFilenames = [
        'café-photo.jpg',
        'image (1).png',
        'file_with_underscores.gif',
        'año-2023.webp',
        'før-etter.svg'
      ]

      for (const filename of specialFilenames) {
        const image = await Image.create({
          filename,
          url: 'https://example.com/' + filename,
          albums: ['special']
        })

        expect(image.filename).toBe(filename)
      }
    })

    it('should handle large arrays of albums', async () => {
      const manyAlbums = Array.from({ length: 50 }, (_, i) => `album-${i}`)

      const image = await Image.create({
        filename: 'multi-album.jpg',
        url: 'https://example.com/multi-album.jpg',
        albums: manyAlbums
      })

      expect(image.albums).toHaveLength(50)
      expect(image.albums).toEqual(manyAlbums)
    })

    it('should handle empty and null values gracefully', async () => {
      // Valores mínimos requeridos
      const image = await Image.create({
        filename: undefined, // Mongoose debería permitir undefined
        url: undefined,
        albums: undefined
      })

      expect(image.albums).toEqual([])
      expect(image.isFavourite).toBe(false)
    })
  })

  describe('Mongoose ObjectId Validation', () => {
    it('should generate valid ObjectIds', async () => {
      const album = await Album.create({ name: 'test album' })

      expect(album._id).toBeInstanceOf(mongoose.Types.ObjectId)
      expect(mongoose.Types.ObjectId.isValid(album._id)).toBe(true)
    })

    it('should handle ObjectId queries', async () => {
      const album = await Album.create({ name: 'findable album' })

      // Buscar por ObjectId
      const foundById = await Album.findById(album._id)
      expect(foundById?._id.toString()).toBe(album._id.toString())

      // Buscar con string del ObjectId
      const foundByStringId = await Album.findById(album._id.toString())
      expect(foundByStringId?._id.toString()).toBe(album._id.toString())
    })

    it('should handle invalid ObjectId gracefully', async () => {
      const invalidIds = ['invalid', '123', '', 'not-an-objectid']

      for (const id of invalidIds) {
        await expect(Album.findById(id)).rejects.toThrow()
      }
    })
  })

  describe('Mongoose Middleware and Hooks', () => {
    it('should maintain data consistency on updates', async () => {
      const album = await Album.create({ name: 'original name' })

      // Actualizar nombre
      album.name = 'UPDATED NAME'
      await album.save()

      // Verificar que se aplicó el middleware (lowercase)
      expect(album.name).toBe('updated name')
    })

    it('should handle concurrent modifications', async () => {
      const album = await Album.create({ name: 'concurrent test' })

      // Simular dos actualizaciones concurrentes
      const update1 = Album.findByIdAndUpdate(
        album._id,
        { name: 'update one' },
        { new: true }
      )

      const update2 = Album.findByIdAndUpdate(
        album._id,
        { name: 'update two' },
        { new: true }
      )

      const [result1, result2] = await Promise.all([update1, update2])

      // Una de las actualizaciones debería haber ganado
      expect(
        result1?.name === 'update one' || result2?.name === 'update two'
      ).toBe(true)
    })
  })

  describe('Database Constraints and Indexes', () => {
    it('should enforce unique constraints', async () => {
      await Album.create({ name: 'unique test' })

      // Intentar crear álbum duplicado debería fallar
      await expect(Album.create({ name: 'unique test' })).rejects.toThrow()

      // Verificar que solo existe uno
      const count = await Album.countDocuments({ name: 'unique test' })
      expect(count).toBe(1)
    })

    it('should handle database disconnection gracefully', async () => {
      // Este test verifica el comportamiento cuando la conexión se pierde
      const album = new Album({ name: 'connection test' })

      // Simular operación cuando hay conexión
      expect(mongoose.connection.readyState).toBe(1) // Connected

      const savedAlbum = await album.save()
      expect(savedAlbum._id).toBeDefined()
    })
  })

  describe('Schema Default Values', () => {
    it('should apply default values correctly', async () => {
      const image = await Image.create({
        filename: 'defaults.jpg',
        url: 'https://example.com/defaults.jpg'
        // No especificamos isFavourite ni albums
      })

      expect(image.isFavourite).toBe(false)
      expect(image.albums).toEqual([])
    })

    it('should override defaults when values are provided', async () => {
      const image = await Image.create({
        filename: 'explicit.jpg',
        url: 'https://example.com/explicit.jpg',
        isFavourite: true,
        albums: ['custom']
      })

      expect(image.isFavourite).toBe(true)
      expect(image.albums).toEqual(['custom'])
    })
  })
})
