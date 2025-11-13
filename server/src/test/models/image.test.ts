import { describe, it, expect, beforeEach } from 'vitest'
import { Image } from '../../models/image.js'

describe('Image Model', () => {
  beforeEach(async () => {
    await Image.deleteMany({})
  })

  describe('Validation', () => {
    it('should create a valid image', async () => {
      const imageData = {
        filename: 'test-image.jpg',
        url: 'https://cloudinary.com/test-image.jpg',
        isFavourite: false,
        albums: ['album1', 'album2']
      }

      const image = new Image(imageData)
      const savedImage = await image.save()

      expect(savedImage.filename).toBe('test-image.jpg')
      expect(savedImage.url).toBe('https://cloudinary.com/test-image.jpg')
      expect(savedImage.isFavourite).toBe(false)
      expect(savedImage.albums).toEqual(['album1', 'album2'])
      expect(savedImage._id).toBeDefined()
    })

    it('should set default values', async () => {
      const image = new Image({
        filename: 'test.jpg',
        url: 'https://test.com/test.jpg'
      })
      const savedImage = await image.save()

      expect(savedImage.isFavourite).toBe(false)
      expect(savedImage.albums).toEqual([])
    })

    it('should allow empty albums array', async () => {
      const image = new Image({
        filename: 'test.jpg',
        url: 'https://test.com/test.jpg',
        albums: []
      })
      const savedImage = await image.save()

      expect(savedImage.albums).toEqual([])
    })

    it('should toggle favourite status', async () => {
      const image = new Image({
        filename: 'test.jpg',
        url: 'https://test.com/test.jpg',
        isFavourite: false
      })
      const savedImage = await image.save()

      // Update to favourite
      const updatedImage = await Image.findByIdAndUpdate(
        savedImage._id,
        { isFavourite: true },
        { new: true }
      )

      expect(updatedImage?.isFavourite).toBe(true)
    })
  })

  describe('CRUD Operations', () => {
    it('should find image by id', async () => {
      const image = new Image({
        filename: 'test.jpg',
        url: 'https://test.com/test.jpg'
      })
      const savedImage = await image.save()

      const foundImage = await Image.findById(savedImage._id)
      expect(foundImage).toBeTruthy()
      expect(foundImage?.filename).toBe('test.jpg')
    })

    it('should update image', async () => {
      const image = new Image({
        filename: 'old-name.jpg',
        url: 'https://test.com/old-name.jpg'
      })
      const savedImage = await image.save()

      const updatedImage = await Image.findByIdAndUpdate(
        savedImage._id,
        { filename: 'new-name.jpg' },
        { new: true }
      )

      expect(updatedImage?.filename).toBe('new-name.jpg')
    })

    it('should delete image', async () => {
      const image = new Image({
        filename: 'to-delete.jpg',
        url: 'https://test.com/to-delete.jpg'
      })
      const savedImage = await image.save()

      await Image.findByIdAndDelete(savedImage._id)

      const deletedImage = await Image.findById(savedImage._id)
      expect(deletedImage).toBeNull()
    })

    it('should find images by album', async () => {
      await Image.create([
        { filename: 'img1.jpg', url: 'url1', albums: ['album1'] },
        { filename: 'img2.jpg', url: 'url2', albums: ['album1', 'album2'] },
        { filename: 'img3.jpg', url: 'url3', albums: ['album2'] }
      ])

      const album1Images = await Image.find({ albums: 'album1' })
      const album2Images = await Image.find({ albums: 'album2' })

      expect(album1Images).toHaveLength(2)
      expect(album2Images).toHaveLength(2)
    })

    it('should find favourite images', async () => {
      await Image.create([
        { filename: 'img1.jpg', url: 'url1', isFavourite: true },
        { filename: 'img2.jpg', url: 'url2', isFavourite: false },
        { filename: 'img3.jpg', url: 'url3', isFavourite: true }
      ])

      const favouriteImages = await Image.find({ isFavourite: true })
      expect(favouriteImages).toHaveLength(2)
    })
  })
})
