import { useRef, useState } from 'react'
import styles from './UploadForm.module.css'

const fileTypes = [
  'image/gif',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/svg',
  'image/tiff',
  'image/webp'
]

interface FileValidation {
  (file: File): boolean;
}

const validFileType: FileValidation = (file: File): boolean => {
  return fileTypes.includes(file.type)
}
interface FileSizeValidation {
  (file: File): boolean;
}

const validFileSize: FileSizeValidation = (file: File): boolean => {
  return file.size <= 2000000
}

const UploadForm = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const form = useRef<HTMLFormElement>(null)
  const [submit, setSubmit] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLoading(true)
    if (!form.current) return
    
    const formData = new FormData(form.current)
    const url = form.current.action
    const fetchOptions = {
      method: form.current.method,
      body: formData,
    }
    
    try {
      const res = await fetch(url, fetchOptions)
      if (!res.ok) {
        setLoading(false)
        throw new Error('Failed to upload images')
        return
      }
      setSubmit(true)
      setLoading(false)

      setTimeout(() => {
        setSelectedFiles([])
        setSubmit(false)
      }, 2000)
    } catch (error) {
      setLoading(false)
      console.error('Error uploading images:', error)
    }
  }

  return (
    <div className={styles.uploadform}>
      <form
        ref={form}
        action='/api/images'
        method='POST'
        encType='multipart/form-data'
      >
        <div>
          <label htmlFor='file'>Choose images to upload</label>
          <input
            type='file'
            name='file'
            id='file'
            accept='images/*'
            multiple
            required
            onChange={handleFiles}
          />
        </div>
        <div className={styles.preview}>
          <ul>
            {selectedFiles.length > 0 && loading && !submit && <span>Loading...</span>}
            {selectedFiles.length > 0 && !loading && submit && (
              <span>Success uploading images</span>
            )}
            {selectedFiles.length === 0 && submit && <span>No files selected</span>}
            {selectedFiles.length > 0 && !selectedFiles.some(validFileSize) && (
              <span>Files must be less than 2Mb</span>
            )}
            {selectedFiles.length > 0 && !selectedFiles.some(validFileType) && (
              <span>Choose valid images</span>
            )}
            {selectedFiles.length > 3 && (
              <span>You can upload up to 3 images at the same time </span>
            )}
            {selectedFiles.length < 4 &&
              !submit &&
              !loading &&
              selectedFiles.every(validFileType) &&
              selectedFiles.every(validFileSize) &&
              selectedFiles.map((file, i) => <li key={i}>{file.name}</li>)}
          </ul>
        </div>
        <div className={styles.submit}>
          <button
            className={styles.uploadBtn}
            type='submit'
            onClick={handleSubmit}
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  )
}

export default UploadForm
