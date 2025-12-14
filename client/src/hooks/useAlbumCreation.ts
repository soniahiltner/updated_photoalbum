import { useState, useEffect } from 'react'
import type { AlbumType, validAlbumName } from '../types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { albumsQueryOptions } from '../queryOptions/imagesQueryOptions'
import { albumService } from '../api/images'

const MIN_NAME_LENGTH = 3
const MAX_NAME_LENGTH = 20

export const useAlbumCreation = () => {
  const [albumName, setAlbumName] = useState('')
  const [validationErrors, setValidationErrors] = useState<validAlbumName[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  const queryClient = useQueryClient()
  const { data } = useQuery(albumsQueryOptions())

  const albums: AlbumType[] = data || []

  const validateAlbumName = (name: string): validAlbumName[] => {
    const errors: validAlbumName[] = []

    const trimmedName = name.trim()

    if (!trimmedName) {
      errors.push({
        type: 'length',
        message: 'Album name is required'
      })
      return errors
    }

    if (
      trimmedName.length < MIN_NAME_LENGTH ||
      trimmedName.length > MAX_NAME_LENGTH
    ) {
      errors.push({
        type: 'length',
        message: `Album name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters`
      })
    }

    const isDuplicate = albums.some(
      (album) => album.name.toLowerCase() === trimmedName.toLowerCase()
    )
    if (isDuplicate) {
      errors.push({
        type: 'duplicate',
        message: 'An album with this name already exists'
      })
    }

    return errors
  }

  const mutation = useMutation({
    mutationFn: (name: string) => albumService.createAlbum(name.trim()),
    onSuccess: () => {
      // Limpiar estado
      setAlbumName('')
      setValidationErrors([])

      // Mostrar mensaje de éxito
      setShowSuccess(true)

      // Invalidar queries de álbumes
      queryClient.invalidateQueries({ queryKey: ['albums'] })
    },
    onError: (error) => {
      setValidationErrors([
        {
          type: 'duplicate',
          message:
            error instanceof Error ? error.message : 'Failed to create album'
        }
      ])
    }
  })

  // Auto-hide del mensaje de éxito después de 3 segundos
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  const handleAlbumNameChange = (name: string) => {
    setAlbumName(name)

    // Limpiar errores cuando el usuario empieza a escribir
    if (validationErrors.length > 0 || mutation.isError) {
      setValidationErrors([])
      mutation.reset()
    }
  }

  const handleCreateAlbum = () => {
    const errors = validateAlbumName(albumName)

    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    mutation.mutate(albumName)
  }

  const reset = () => {
    setAlbumName('')
    setValidationErrors([])
    mutation.reset()
  }

  return {
    // Estado
    albumName,
    validationErrors,
    isLoading: mutation.isPending,
    isSuccess: showSuccess,
    isError: mutation.isError,
    error: mutation.error,

    // Acciones
    setAlbumName: handleAlbumNameChange,
    createAlbum: handleCreateAlbum,
    reset,

    // Validación
    canCreate:
      albumName.trim().length >= MIN_NAME_LENGTH &&
      albumName.trim().length <= MAX_NAME_LENGTH &&
      !mutation.isPending
  }
}
