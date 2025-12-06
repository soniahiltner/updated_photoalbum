import type { Image, AlbumType } from '../types'
import { apiClient } from './apiclient'
import type { PaginatedResponse } from '../types'

class ImageService {
  private static instance: ImageService

  private constructor() {}

  static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService()
    }
    return ImageService.instance
  }

  // Get all images with pagination
  async getImages(pageNumber: number = 1): Promise<PaginatedResponse> {
    return apiClient.get<PaginatedResponse>('/images', { page: pageNumber })
  }

  // Get favourite images with pagination
  async getFavourites(favPageNumber: number = 1): Promise<PaginatedResponse> {
    return apiClient.get<PaginatedResponse>('/images', {
      isFavourite: true,
      favPage: favPageNumber
    })
  }

  // Get all images for one album with pagination
  async getAlbumImages(
    albumName: string,
    pageNumber: number = 1
  ): Promise<PaginatedResponse> {
    return apiClient.get<PaginatedResponse>(`/images/${albumName}`, {
      page: pageNumber
    })
  }

  // Get last image for one album
  async getAlbumLastImage(albumName: string): Promise<Image> {
    return apiClient.get<Image>(`/images/${albumName}`, { last: true })
  }

  // Upload images
  async uploadImages(files: File[]): Promise<PaginatedResponse> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('file', file)
    })
    return apiClient.post<PaginatedResponse>('/images', formData)
  }

  // Update image favourite status
  async updateImageFavourite(
    imageId: string,
    isFavourite: boolean
  ): Promise<{ images: Image[]; favCount: number }> {
    return apiClient.patch<{ images: Image[]; favCount: number }>(
      `/images/${imageId}/favourite`,
      { isFavourite }
    )
  }

  // Update image albums
  async updateImageAlbums(
    imageId: string,
    albums?: string[],
    albumName?: string
  ): Promise<Image | { message: string }> {
    return apiClient.patch<Image | { message: string }>(
      `/images/${imageId}/albums`,
      {
        albums,
        albumName
      }
    )
  }

  // Delete image
  async deleteImage(imageId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/images/${imageId}`)
  }
}

class AlbumService {
  private static instance: AlbumService

  private constructor() {}

  static getInstance(): AlbumService {
    if (!AlbumService.instance) {
      AlbumService.instance = new AlbumService()
    }
    return AlbumService.instance
  }

  // Get all albums
  async getAlbums(): Promise<AlbumType[]> {
    return apiClient.get<AlbumType[]>('/albums')
  }

  // Create album
  async createAlbum(name: string): Promise<AlbumType> {
    return apiClient.post<AlbumType>('/albums', { name })
  }

  // Delete album
  async deleteAlbum(albumName: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/albums/${albumName}`)
  }
}

// Export singleton instances
export const imageService = ImageService.getInstance()
export const albumService = AlbumService.getInstance()

// Export for backwards compatibility (optional)
export const getImages = (page: number) => imageService.getImages(page)
export const getFavourites = (page: number) => imageService.getFavourites(page)
export const getAlbumImages = (albumName: string, page: number) =>
  imageService.getAlbumImages(albumName, page)
export const getAlbumLastImage = (albumName: string) =>
  imageService.getAlbumLastImage(albumName)
export const updateImageFavourite = (imageId: string, isFavourite: boolean) =>
  imageService.updateImageFavourite(imageId, isFavourite)
export const updateImageAlbums = (
  imageId: string,
  albums?: string[],
  albumName?: string
) => imageService.updateImageAlbums(imageId, albums, albumName)
export const deleteImage = (imageId: string) =>
  imageService.deleteImage(imageId)
export const getAlbums = () => albumService.getAlbums()
export const createAlbum = (albumName: string) =>
  albumService.createAlbum(albumName)
export const deleteAlbum = (albumName: string) =>
  albumService.deleteAlbum(albumName)
