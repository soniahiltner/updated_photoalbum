import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Album, DeleteImageIconProps, Image } from '../../types'
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
    }
  })

  // Remove image from album- update image's albums array
  const removeImageFromAlbum = useMutation({
    mutationFn: (updatedImage: Image) => imageService.updateImageAlbums(updatedImage._id!, updatedImage.albums),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['images'] })
    }
  })

  const deleteImage = (image: Image, album?: Album
  ) => {
    if (album) {
      // Remove image from album
      const updatedAlbums = image?.albums?.filter(
        (alb: string) => alb !== album.name
      )
      removeImageFromAlbum.mutate({ ...image, albums: updatedAlbums })
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