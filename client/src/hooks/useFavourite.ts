import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { InfiniteData } from '@tanstack/react-query'
import { imageService } from '../api/images'
import type { Image } from '../types'

interface PageData {
  images: Image[]
  page: number
  totalPages: number
}

export const useFavourite = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({
      imageId,
      isFavourite
    }: {
      imageId: string
      isFavourite: boolean
    }) => imageService.updateImageFavourite(imageId, isFavourite),

    onSuccess: async (_, { imageId, isFavourite }) => {
      // Actualizar query de 'images' - solo cambiar el estado
      queryClient.setQueryData<InfiniteData<PageData>>(['images'], (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            images: page.images.map((img) =>
              img._id === imageId ? { ...img, isFavourite } : img
            )
          }))
        }
      })

      // Actualizar query de 'favourites' - eliminar si ya no es favorito
      queryClient.setQueryData<InfiniteData<PageData>>(
        ['favourites'],
        (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              images: isFavourite
                ? page.images.map((img) =>
                    img._id === imageId ? { ...img, isFavourite } : img
                  )
                : page.images.filter((img) => img._id !== imageId) // Eliminar si ya no es favorito
            }))
          }
        }
      )

      // Actualizar query de 'albumImages' - solo cambiar el estado
      queryClient.setQueriesData<InfiniteData<PageData>>(
        { queryKey: ['albumImages'] },
        (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              images: page.images.map((img) =>
                img._id === imageId ? { ...img, isFavourite } : img
              )
            }))
          }
        }
      )

      // Forzar re-render invalidando sin refetch
      queryClient.invalidateQueries({
        queryKey: ['images'],
        refetchType: 'none'
      })
      queryClient.invalidateQueries({
        queryKey: ['favourites'],
        refetchType: 'none'
      })
      queryClient.invalidateQueries({
        queryKey: ['albumImages'],
        refetchType: 'none'
      })
    },

    onError: (err) => {
      console.error('Error updating favourite:', err)
    }
  })

  const toggleFavourite = (
    imageId: string,
    currentFavouriteStatus: boolean
  ) => {
    mutation.mutate({
      imageId,
      isFavourite: !currentFavouriteStatus
    })
  }

  return {
    toggleFavourite,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  }
}
