import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AlbumType, DeleteImageIconProps, Image } from '../../types'
import styles from './DeleteImageIcon.module.css'
import { imageService } from '../../api/images'

const DeleteImageIcon = ({ image, album }: DeleteImageIconProps) => {
  const queryClient = useQueryClient()

  // Remove image from database
  const deleteImageFromDatabase = useMutation({
    mutationFn: imageService.deleteImage,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['images'] })
      queryClient.invalidateQueries({ queryKey: ['albumImages'] })
      queryClient.invalidateQueries({ queryKey: ['favourites'] })
    }
  })

  // Remove image from album - send albumName to remove it
  const removeImageFromAlbum = useMutation({
    mutationFn: ({
      imageId,
      albumName
    }: {
      imageId: string
      albumName: string
    }) => imageService.updateImageAlbums(imageId, undefined, albumName),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['images'] })
      queryClient.invalidateQueries({ queryKey: ['albumImages'] })
    }
  })

  const deleteImage = (image: Image, album?: AlbumType) => {
    if (album) {
      // Remove image from album by sending albumName
      removeImageFromAlbum.mutate({
        imageId: image._id!,
        albumName: album.name
      })
    } else {
      // Delete image from database
      deleteImageFromDatabase.mutate(image._id!)
    }
  }

  return (
    <span
      className={styles.binButton}
      onClick={() => deleteImage(image, album)}
    >
      <i className='fa fa-trash'></i>
    </span>
  )
}

export default DeleteImageIcon
