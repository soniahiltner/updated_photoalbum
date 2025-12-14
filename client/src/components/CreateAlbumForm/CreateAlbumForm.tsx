import styles from './CreateAlbumForm.module.css'
import { useAlbumCreation } from '../../hooks/useAlbumCreation'

const CreateAlbumForm = () => {
  const {
    albumName,
    validationErrors,
    isLoading,
    isSuccess,
    setAlbumName,
    createAlbum,
    canCreate
  } = useAlbumCreation()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createAlbum()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumName(e.target.value)
  }

  const errorMessage =
    validationErrors.length > 0 ? validationErrors[0].message : ''

  return (
    <div className={styles.albumForm}>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <label htmlFor='name'>Add a new album</label>
          <input
            type='text'
            id='name'
            name='name'
            placeholder='Album name'
            value={albumName}
            onChange={handleChange}
            disabled={isLoading}
            autoComplete='off'
          />
        </div>

        <button
          type='submit'
          disabled={!canCreate}
        >
          {isLoading ? 'Adding...' : 'Add'}
        </button>

        <div className={styles.responseMessage}>
          {errorMessage && <span>{errorMessage}</span>}
          {isSuccess && (
            <span className={styles.success}>Album created successfully!</span>
          )}
        </div>
      </form>
      <hr />
    </div>
  )
}

export default CreateAlbumForm
