import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { imageService } from '../api/images'

export const useAddToAlbum = () => {
  const [selectedAlbum, setSelectedAlbum] = useState('')
  const [error, setError] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ imageId, albums }: { imageId: string; albums: string[] }) =>
      imageService.updateImageAlbums(imageId, albums),

    onSuccess: () => {
      // Limpiar estado
      setSelectedAlbum('')
      setError('')

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['images'] })
      queryClient.invalidateQueries({ queryKey: ['favourites'] })
      queryClient.invalidateQueries({ queryKey: ['albums'] })
    },

    onError: (err) => {
      setError(
        err instanceof Error ? err.message : 'Failed to add image to album'
      )
    }
  })

  const handleAlbumChange = (album: string) => {
    setSelectedAlbum(album)
    // Limpiar error al cambiar selección
    if (error) {
      setError('')
    }
  }

  const addToAlbum = (imageId: string) => {
    // Validar que se haya seleccionado un álbum
    if (!selectedAlbum || selectedAlbum.length === 0) {
      setError('Please choose an album')
      return
    }

    // Ejecutar mutación
    mutation.mutate({
      imageId,
      albums: [selectedAlbum]
    })
  }

  const reset = () => {
    setSelectedAlbum('')
    setError('')
    mutation.reset()
  }

  return {
    selectedAlbum,
    error,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    handleAlbumChange,
    addToAlbum,
    reset
  }
}
