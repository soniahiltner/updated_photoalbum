import { describe, it, expect, beforeEach } from 'vitest'
import { Album } from '../../models/album.js'
import { Image } from '../../models/image.js'

describe('Model Integration Tests', () => {
  beforeEach(async () => {
    await Album.deleteMany({})
    await Image.deleteMany({})
  })

  describe('Album and Image Relationships', () => {
    it('should create album and associate images', async () => {
      // Crear álbum
      const album = new Album({ name: 'vacation photos' })
      const savedAlbum = await album.save()

      // Crear imágenes asociadas al álbum
      const image1 = new Image({
        filename: 'beach.jpg',
        url: 'https://example.com/beach.jpg',
        albums: [savedAlbum.name]
      })

      const image2 = new Image({
        filename: 'sunset.jpg',
        url: 'https://example.com/sunset.jpg',
        albums: [savedAlbum.name]
      })

      await image1.save()
      await image2.save()

      // Verificar asociaciones
      const albumImages = await Image.find({ albums: savedAlbum.name })
      expect(albumImages).toHaveLength(2)
      expect(albumImages.map((img) => img.filename)).toContain('beach.jpg')
      expect(albumImages.map((img) => img.filename)).toContain('sunset.jpg')
    })

    it('should handle image in multiple albums', async () => {
      // Crear múltiples álbumes
      const album1 = await Album.create({ name: 'vacation' })
      const album2 = await Album.create({ name: 'summer' })

      // Crear imagen que pertenece a ambos álbumes
      const image = await Image.create({
        filename: 'shared.jpg',
        url: 'https://example.com/shared.jpg',
        albums: [album1.name, album2.name]
      })

      // Verificar que la imagen aparece en ambos álbumes
      const album1Images = await Image.find({ albums: album1.name })
      const album2Images = await Image.find({ albums: album2.name })

      expect(album1Images).toHaveLength(1)
      expect(album2Images).toHaveLength(1)
      expect(album1Images[0]?._id.toString()).toBe(image._id.toString())
      expect(album2Images[0]?._id.toString()).toBe(image._id.toString())
    })

    it('should remove album reference from images when album is deleted', async () => {
      // Crear álbum e imagen
      const album = await Album.create({ name: 'to delete' })
      const image = await Image.create({
        filename: 'test.jpg',
        url: 'https://example.com/test.jpg',
        albums: [album.name, 'other album']
      })

      // Simular eliminación de álbum y limpieza de referencias
      await Album.findByIdAndDelete(album._id)

      // Remover referencias del álbum eliminado de las imágenes
      await Image.updateMany(
        { albums: album.name },
        { $pull: { albums: album.name } }
      )

      const updatedImage = await Image.findById(image._id)
      expect(updatedImage?.albums).toEqual(['other album'])
    })
  })

  describe('Advanced Queries', () => {
    it('should find albums by partial name match', async () => {
      await Album.create([
        { name: 'summer vacation' },
        { name: 'winter vacation' },
        { name: 'work photos' }
      ])

      const vacationAlbums = await Album.find({
        name: { $regex: 'vacation', $options: 'i' }
      })

      expect(vacationAlbums).toHaveLength(2)
      expect(vacationAlbums.map((a) => a.name)).toEqual([
        'summer vacation',
        'winter vacation'
      ])
    })

    it('should find favourite images across all albums', async () => {
      await Image.create([
        {
          filename: 'img1.jpg',
          url: 'url1',
          isFavourite: true,
          albums: ['album1']
        },
        {
          filename: 'img2.jpg',
          url: 'url2',
          isFavourite: false,
          albums: ['album1']
        },
        {
          filename: 'img3.jpg',
          url: 'url3',
          isFavourite: true,
          albums: ['album2']
        },
        {
          filename: 'img4.jpg',
          url: 'url4',
          isFavourite: true,
          albums: ['album1', 'album2']
        }
      ])

      const favourites = await Image.find({ isFavourite: true }).sort({
        filename: 1
      })

      expect(favourites).toHaveLength(3)
      expect(favourites.map((img) => img.filename)).toEqual([
        'img1.jpg',
        'img3.jpg',
        'img4.jpg'
      ])
    })

    it('should count images per album', async () => {
      await Image.create([
        { filename: 'img1.jpg', url: 'url1', albums: ['nature'] },
        { filename: 'img2.jpg', url: 'url2', albums: ['nature'] },
        { filename: 'img3.jpg', url: 'url3', albums: ['portrait'] },
        { filename: 'img4.jpg', url: 'url4', albums: ['nature', 'portrait'] }
      ])

      // Aggregation para contar imágenes por álbum
      const pipeline = [
        { $unwind: '$albums' },
        { $group: { _id: '$albums', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ] as any[]

      const result = await Image.aggregate(pipeline)

      expect(result).toEqual([
        { _id: 'nature', count: 3 },
        { _id: 'portrait', count: 2 }
      ])
    })
  })

  describe('Data Validation Edge Cases', () => {
    it('should handle special characters in album names', async () => {
      const specialNames = [
        'café & restaurant',
        'año 2023',
        'før-etter',
        'müller family'
      ]

      for (const name of specialNames) {
        const album = new Album({ name })
        const saved = await album.save()
        expect(saved.name).toBe(name.toLowerCase())
      }
    })

    it('should handle empty albums array in images', async () => {
      const image = await Image.create({
        filename: 'orphan.jpg',
        url: 'https://example.com/orphan.jpg',
        albums: []
      })

      expect(image.albums).toEqual([])

      // Buscar imágenes sin álbum
      const orphanImages = await Image.find({ albums: { $size: 0 } })
      expect(orphanImages).toHaveLength(1)
      expect(orphanImages[0]?._id.toString()).toBe(image._id.toString())
    })

    it('should handle concurrent album creation', async () => {
      const albumPromises = Array.from({ length: 5 }, (_, i) =>
        Album.create({ name: `concurrent ${i}` })
      )

      const albums = await Promise.all(albumPromises)

      expect(albums).toHaveLength(5)
      albums.forEach((album, index) => {
        expect(album.name).toBe(`concurrent ${index}`)
      })
    })
  })

  describe('Model Performance', () => {
    it('should handle bulk operations efficiently', async () => {
      const startTime = Date.now()

      // Crear 100 imágenes
      const imageData = Array.from({ length: 100 }, (_, i) => ({
        filename: `bulk-${i}.jpg`,
        url: `https://example.com/bulk-${i}.jpg`,
        albums: [`album-${i % 10}`] // 10 álbumes diferentes
      }))

      await Image.insertMany(imageData)

      const endTime = Date.now()
      const duration = endTime - startTime

      // Verificar que se crearon todas las imágenes
      const count = await Image.countDocuments()
      expect(count).toBe(100)

      // Verificar que la operación fue razonablemente rápida
      expect(duration).toBeLessThan(5000) // menos de 5 segundos
    })

    it('should index queries perform well', async () => {
      // Crear datos de prueba
      await Image.insertMany(
        Array.from({ length: 50 }, (_, i) => ({
          filename: `perf-${i}.jpg`,
          url: `https://example.com/perf-${i}.jpg`,
          albums: [`album-${i % 5}`],
          isFavourite: i % 3 === 0
        }))
      )

      const startTime = Date.now()

      // Realizar búsquedas que deberían beneficiarse de índices
      const favouriteResults = await Image.find({ isFavourite: true })
      const albumResults = await Image.find({ albums: 'album-1' })

      const endTime = Date.now()
      const duration = endTime - startTime

      expect(favouriteResults.length).toBeGreaterThan(0)
      expect(albumResults.length).toBeGreaterThan(0)
      expect(duration).toBeLessThan(1000) // menos de 1 segundo
    })
  })
})
