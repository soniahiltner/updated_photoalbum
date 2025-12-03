import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { imageService } from '../api/images'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const MAX_FILES = 3
const ALLOWED_TYPES = [
  'image/gif',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/svg',
  'image/tiff',
  'image/webp'
]

interface ValidationError {
  type: 'size' | 'type' | 'count'
  message: string
}

export const useImageUpload = () => {
  const [files, setFilesState] = useState<File[]>([])
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  )
  const queryClient = useQueryClient()

  const validateFiles = (files: File[]): ValidationError[] => {
    const errors: ValidationError[] = []

    if (files.length > MAX_FILES) {
      errors.push({
        type: 'count',
        message: `You can upload up to ${MAX_FILES} images at the same time`
      })
    }

    const hasInvalidType = files.some(
      (file) => !ALLOWED_TYPES.includes(file.type)
    )
    if (hasInvalidType) {
      errors.push({
        type: 'type',
        message: 'Please choose valid image files'
      })
    }

    const hasLargeFile = files.some((file) => file.size > MAX_FILE_SIZE)
    if (hasLargeFile) {
      errors.push({
        type: 'size',
        message: 'Files must be less than 2MB'
      })
    }

    return errors
  }

  const mutation = useMutation({
    mutationFn: (files: File[]) => imageService.uploadImages(files),
    onSuccess: () => {
      // Invalidar la caché de imágenes para refetch automático
      queryClient.invalidateQueries({ queryKey: ['images'] })

      // Reset después de 2 segundos
      setTimeout(() => {
        setFilesState([])
        setValidationErrors([])
        mutation.reset()
      }, 2000)
    }
  })

  const setFiles = (newFiles: File[]) => {
    const errors = validateFiles(newFiles)
    setFilesState(newFiles)
    setValidationErrors(errors)

    // Reset mutation state cuando se seleccionan nuevos archivos
    if (mutation.isSuccess || mutation.isError) {
      mutation.reset()
    }
  }

  const uploadImages = () => {
    if (files.length === 0 || validationErrors.length > 0) {
      return
    }
    mutation.mutate(files)
  }

  const reset = () => {
    setFilesState([])
    setValidationErrors([])
    mutation.reset()
  }

  return {
    files,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error?.message || null,
    validationErrors,
    setFiles,
    uploadImages,
    reset,
    canUpload:
      files.length > 0 && validationErrors.length === 0 && !mutation.isPending
  }
}
