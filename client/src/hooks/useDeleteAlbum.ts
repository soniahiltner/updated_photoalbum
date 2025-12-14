import { useMutation, useQueryClient } from '@tanstack/react-query'
import { albumService } from '../api/images'

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (albumName: string) => albumService.deleteAlbum(albumName),
    onSuccess: () => {
      // Invalidate albums list to refetch
      queryClient.invalidateQueries({ queryKey: ['albums'] })
      // Also invalidate images without resetting pages
      queryClient.invalidateQueries({
        queryKey: ['images'],
        refetchType: 'active'
      })
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
