import { useMutation, useQueryClient } from '@tanstack/react-query'
import { albumService } from '../api/images'

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (albumName: string) => albumService.deleteAlbum(albumName),
    onSuccess: () => {
      // Invalidate albums list to refetch
      queryClient.invalidateQueries({ queryKey: ['albums'] })
      // Also invalidate images in case they were filtered by album
      queryClient.invalidateQueries({ queryKey: ['images'] })
    }
  })

  const deleteAlbum = (albumName: string) => {
    mutation.mutate(albumName)
  }

  return {
    deleteAlbum,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error
  }
}
