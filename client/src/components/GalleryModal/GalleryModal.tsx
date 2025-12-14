import { useEffect } from 'react'
import type { GalleryModalProps } from '../../types'
import styles from './GalleryModal.module.css'

const GalleryModal = ({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext
}: GalleryModalProps) => {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && currentIndex > 0) onPrev()
      if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, images.length, onClose, onNext, onPrev])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleBackdropClick}
      role='dialog'
      aria-modal='true'
    >
      <button
        className={styles.closeBtn}
        aria-label='Close modal'
        onClick={onClose}
      >
        <i className='fa fa-times'></i>
      </button>

      <button
        className={`${styles.prevBtn} ${
          currentIndex === 0 ? styles.disabled : ''
        }`}
        aria-label='Previous image'
        onClick={onPrev}
        disabled={currentIndex === 0}
      >
        <i className='fa fa-chevron-left'></i>
      </button>

      <button
        className={`${styles.nextBtn} ${
          currentIndex === images.length - 1 ? styles.disabled : ''
        }`}
        aria-label='Next image'
        onClick={onNext}
        disabled={currentIndex === images.length - 1}
      >
        <i className='fa fa-chevron-right'></i>
      </button>

      <div className={styles.imageContainer}>
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].filename}
          className={styles.image}
        />
        <div className={styles.imageInfo}>
          <span className={styles.imageCounter}>
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  )
}

export default GalleryModal
