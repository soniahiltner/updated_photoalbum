import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { albumService, imageService } from '../api/images'

// Infinite query for images
export const imagesInfiniteQueryOptions = () => {
  return infiniteQueryOptions({
    queryKey: ['images'],
    queryFn: ({ pageParam = 1 }) => imageService.getImages(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1
      }
      return undefined
    },
    initialPageParam: 1
  })
}

// Infinite query for favourites
export const favouritesInfiniteQueryOptions = () => {
  return infiniteQueryOptions({
    queryKey: ['favourites'],
    queryFn: ({ pageParam = 1 }) => imageService.getFavourites(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1
      }
      return undefined
    },
    initialPageParam: 1
  })
}

// Infinite query for album images
export const albumImagesInfiniteQueryOptions = (albumName: string) => {
  return infiniteQueryOptions({
    queryKey: ['albumImages', albumName],
    queryFn: ({ pageParam = 1 }) =>
      imageService.getAlbumImages(albumName, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1
      }
      return undefined
    },
    initialPageParam: 1
  })
}

//albumsQueryOptions
export const albumsQueryOptions = () => {
  return queryOptions({
    queryKey: ['albums'],
    queryFn: () => albumService.getAlbums()
  })
}
