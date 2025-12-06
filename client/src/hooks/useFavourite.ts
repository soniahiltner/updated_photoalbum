import { useMutation, useQueryClient } from '@tanstack/react-query'
import { imageService } from '../api/images'
import type { Image } from '../types'

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

    // Actualización optimista
    onMutate: async ({ imageId, isFavourite }) => {
      // Cancelar refetch en progreso para todas las queries relacionadas
      await queryClient.cancelQueries({ queryKey: ['images'] })
      await queryClient.cancelQueries({ queryKey: ['favourites'] })

      // Guardar snapshot del estado anterior
      const previousImages = queryClient.getQueriesData({
        queryKey: ['images']
      })
      const previousFavourites = queryClient.getQueriesData({
        queryKey: ['favourites']
      })

      // Actualizar optimistamente queries de imágenes normales
      queryClient.setQueriesData<{
        images: Image[]
        page: number
        totalPages: number
        count: number
      }>({ queryKey: ['images'] }, (old) => {
        if (!old) return old

        return {
          ...old,
          images: old.images.map((img) =>
            img._id === imageId ? { ...img, isFavourite } : img
          )
        }
      })

      // Actualizar optimistamente queries de favoritos
      queryClient.setQueriesData<{
        images: Image[]
        page: number
        totalPages: number
        count: number
      }>({ queryKey: ['favourites'] }, (old) => {
        if (!old) return old

        // Si estamos quitando de favoritos, filtrar la imagen
        if (!isFavourite) {
          return {
            ...old,
            images: old.images.filter((img) => img._id !== imageId),
            count: old.count - 1
          }
        }

        // Si estamos agregando a favoritos, verificar si ya está en la lista
        const imageExists = old.images.some((img) => img._id === imageId)

        if (imageExists) {
          // Ya existe, solo actualizar el estado
          return {
            ...old,
            images: old.images.map((img) =>
              img._id === imageId ? { ...img, isFavourite } : img
            )
          }
        }

        // No existe en favoritos, invalidar para refetch
        // (no podemos agregar porque no tenemos todos los datos de la imagen)
        return old
      })

      // Retornar contexto con snapshot para rollback si falla
      return { previousImages, previousFavourites }
    },

    // Si la mutación falla, hacer rollback
    onError: (err, _variables, context) => {
      console.error('Error updating favourite:', err)

      if (context?.previousImages) {
        // Restaurar datos anteriores de imágenes
        context.previousImages.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }

      if (context?.previousFavourites) {
        // Restaurar datos anteriores de favoritos
        context.previousFavourites.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },

    // Siempre refetch después de éxito para sincronizar con el servidor
    onSuccess: () => {
      // Invalidar y forzar refetch inmediato
      queryClient.invalidateQueries({
        queryKey: ['images'],
        refetchType: 'active' // Solo refetch de queries activas
      })
      queryClient.invalidateQueries({
        queryKey: ['favourites'],
        refetchType: 'all' // Refetch todas las queries de favoritos
      })
      queryClient.invalidateQueries({
        queryKey: ['albumImages'],
        refetchType: 'active' // Refetch album images si está activa
      })
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
