import { useImageUpload } from '../../hooks/useImageUpload'
import styles from './UploadForm.module.css'

const UploadForm = () => {
  const {
    files,
    isLoading,
    isSuccess,
    error,
    validationErrors,
    setFiles,
    uploadImages,
    canUpload
  } = useImageUpload()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    uploadImages()
  }

  return (
    <div className={styles.uploadform}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='file'>Choose images to upload</label>
          <input
            type='file'
            name='file'
            id='file'
            accept='image/*'
            multiple
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>

        <div className={styles.preview}>
          <ul>
            {isLoading && <span>Loading...</span>}

            {isSuccess && <span>Success uploading images!</span>}

            {error && <span className={styles.error}>{error}</span>}

            {validationErrors.map((err, index) => (
              <span
                key={index}
                className={styles.error}
              >
                {err.message}
              </span>
            ))}

            {files.length > 0 &&
              !isLoading &&
              !isSuccess &&
              validationErrors.length === 0 &&
              files.map((file, i) => <li key={i}>{file.name}</li>)}
          </ul>
        </div>

        <div className={styles.submit}>
          <button
            className={styles.uploadBtn}
            type='submit'
            disabled={!canUpload || isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UploadForm
