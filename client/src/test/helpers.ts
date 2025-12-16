import { describe, it, expect } from 'vitest'

// Utility functions for testing
export const mockImage = {
  _id: '1',
  filename: 'test.jpg',
  url: 'https://example.com/test.jpg',
  isFavourite: false,
  albums: []
}

export const mockAlbum = {
  _id: 'album1',
  name: 'Test Album'
}

describe('Test Helpers', () => {
  it('provides mock image data', () => {
    expect(mockImage).toHaveProperty('_id')
    expect(mockImage).toHaveProperty('filename')
    expect(mockImage).toHaveProperty('url')
  })

  it('provides mock album data', () => {
    expect(mockAlbum).toHaveProperty('_id')
    expect(mockAlbum).toHaveProperty('name')
  })
})
