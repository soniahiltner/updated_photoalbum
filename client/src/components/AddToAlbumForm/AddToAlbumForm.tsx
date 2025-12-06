import { useEffect } from 'react'
import styles from './AddToAlbumForm.module.css'
import type { AddToAlbumFormProps, AlbumType } from '../../types'
import { useQuery } from '@tanstack/react-query'
import { albumsQueryOptions } from '../../queryOptions/imagesQueryOptions'
import { useAddToAlbum } from '../../hooks/useAddToAlbum'

const AddToAlbumForm = ({ image, setOpenSelect }: AddToAlbumFormProps) => {
  const { data } = useQuery(albumsQueryOptions())
  const {
    selectedAlbum,
    error,
    isLoading,
    isSuccess,
    handleAlbumChange,
    addToAlbum
  } = useAddToAlbum()

  const albums: AlbumType[] = data || []

  const options = albums.map((item: AlbumType) => {
    return { label: item.name, val: item.name }
  })

  // Cerrar modal después de éxito
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setOpenSelect(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, setOpenSelect])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (image._id) {
      addToAlbum(image._id)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleAlbumChange(e.target.value)
  }

  return (
    <div
      className={styles.selectFormContainer}
      onClick={() => setOpenSelect(false)}
    >
      <form
        className={styles.selectForm}
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <label>Add to:</label>
        <select
          size={4}
          name='album'
          value={selectedAlbum}
          onChange={handleChange}
          required
        >
          <option value=''></option>
          {options.map((option, index) => (
            <option
              key={index}
              value={option.val}
            >
              {option.label}
            </option>
          ))}
        </select>

        <div className={styles.btnSelectContainer}>
          <button
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Submit'}
          </button>
          <button
            type='button'
            onClick={() => setOpenSelect(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
        {error && <span className={styles.error}>{error}</span>}
        {isSuccess && (
          <span className={styles.success}>Added successfully!</span>
        )}
      </form>
    </div>
  )
}

export default AddToAlbumForm
