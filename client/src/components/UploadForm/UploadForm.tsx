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

  const hasErrors = error || validationErrors.length > 0
  const errorId = 'upload-errors'
  const successId = 'upload-success'
  const loadingId = 'upload-loading'

  return (
    <div className={styles.uploadform}>
      <form
        onSubmit={handleSubmit}
        aria-label='Upload images form'
      >
        <div className={styles.inputWrapper}>
          <label htmlFor='file' tabIndex={0}>Choose images to upload</label>
          <span
            className={styles.hint}
            aria-label='Maximum 3 images, 2MB each'
          >
            (Max 3 images, 2MB each)
          </span>
          <input
            type='file'
            name='file'
            id='file'
            accept='image/*'
            multiple
            onChange={handleFileChange}
            disabled={isLoading}
            aria-describedby={
              hasErrors ? errorId : files.length > 0 ? 'file-list' : undefined
            }
            aria-invalid={hasErrors ? 'true' : 'false'}
            aria-required='true'
          />
        </div>

        {/* Live region for status messages */}
        <div
          className={styles.preview}
          role='status'
          aria-live='polite'
          aria-atomic='true'
        >
          {isLoading && (
            <div
              id={loadingId}
              className={styles.statusMessage}
            >
              <i
                className='fa fa-spinner fa-spin'
                aria-hidden='true'
              ></i>
              <span> Uploading images...</span>
            </div>
          )}

          {isSuccess && (
            <div
              id={successId}
              className={styles.successMessage}
              role='alert'
            >
              <i
                className='fa fa-check-circle'
                aria-hidden='true'
              ></i>
              <span> Images uploaded successfully!</span>
            </div>
          )}

          {/* Error messages */}
          {hasErrors && (
            <div
              id={errorId}
              className={styles.errorContainer}
              role='alert'
              aria-live='assertive'
            >
              {error && (
                <div className={styles.error}>
                  <i
                    className='fa fa-exclamation-circle'
                    aria-hidden='true'
                  ></i>
                  <span> {error}</span>
                </div>
              )}
              {validationErrors.map((err, index) => (
                <div
                  key={index}
                  className={styles.error}
                >
                  <i
                    className='fa fa-exclamation-triangle'
                    aria-hidden='true'
                  ></i>
                  <span> {err.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* File list preview */}
          {files.length > 0 &&
            !isLoading &&
            !isSuccess &&
            validationErrors.length === 0 && (
              <div id='file-list'>
                <p className={styles.fileListTitle}>
                  Selected files ({files.length}):
                </p>
                <ul aria-label='Selected files'>
                  {files.map((file, i) => (
                    <li key={i}>
                      <i
                        className='fa fa-file-image-o'
                        aria-hidden='true'
                      ></i>
                      <span> {file.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>

        <div className={styles.submit}>
          <button
            className={styles.uploadBtn}
            type='submit'
            disabled={!canUpload || isLoading}
            aria-label={
              isLoading ? 'Uploading images' : 'Upload selected images'
            }
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <i
                  className='fa fa-spinner fa-spin'
                  aria-hidden='true'
                ></i>
                <span> Uploading...</span>
              </>
            ) : (
              <>
                <i
                  className='fa fa-upload'
                  aria-hidden='true'
                ></i>
                <span> Upload</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UploadForm
