import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { InfiniteData } from '@tanstack/react-query'
import type { AlbumType, DeleteImageIconProps, Image } from '../../types'
import styles from './DeleteImageIcon.module.css'
import { imageService } from '../../api/images'
import Tooltip from '../Tooltip/Tooltip'
import { useIconHover } from '../../hooks/useIconHover'

interface PageData {
  images: Image[]
  page: number
  totalPages: number
}

const DeleteImageIcon = ({ image, album }: DeleteImageIconProps) => {
  const { hovering, hoverHandlers } = useIconHover()

  const queryClient = useQueryClient()

  // Remove image from database
  const deleteImageFromDatabase = useMutation({
    mutationFn: imageService.deleteImage,
    onSuccess: (_, imageId) => {
      // Eliminar imagen de todas las cachés sin resetear páginas
      queryClient.setQueryData<InfiniteData<PageData>>(
        ['images'],
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              images: page.images.filter((img) => img._id !== imageId)
            }))
          }
        }
      )

      queryClient.setQueryData<InfiniteData<PageData>>(
        ['favourites'],
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              images: page.images.filter((img) => img._id !== imageId)
            }))
          }
        }
      )

      queryClient.setQueriesData<InfiniteData<PageData>>(
        { queryKey: ['albumImages'] },
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              images: page.images.filter((img) => img._id !== imageId)
            }))
          }
        }
      )
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
    onSuccess: (_, { imageId, albumName }) => {
      // Actualizar caché para remover el álbum de la imagen
      queryClient.setQueryData<InfiniteData<PageData>>(
        ['images'],
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              images: page.images.map((img) =>
                img._id === imageId
                  ? {
                      ...img,
                      albums: img.albums?.filter((a) => a !== albumName)
                    }
                  : img
              )
            }))
          }
        }
      )

      // Remover de albumImages específico
      queryClient.setQueryData<InfiniteData<PageData>>(
        ['albumImages', albumName],
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              images: page.images.filter((img) => img._id !== imageId)
            }))
          }
        }
      )
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
    <button
      className={`icon ${styles.binButton}`}
      onClick={() => deleteImage(image, album)}
      {...hoverHandlers}
      aria-label='Delete Image'
    >
      <i className='fa fa-trash'></i>
      {hovering && (
        <Tooltip
          text='Delete'
          position='bottomLeft'
        />
      )}
    </button>
  )
}

export default DeleteImageIcon
