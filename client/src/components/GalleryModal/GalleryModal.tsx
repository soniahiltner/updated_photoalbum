import { useEffect, useState } from 'react'
import type { GalleryModalProps } from '../../types'
import styles from './GalleryModal.module.css'

const GalleryModal = ({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext
}: GalleryModalProps) => {
  const currentImage = images[currentIndex]

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

  // Preload adjacent images 
  useEffect(() => {
    const preloadImages = []

    // Preload next image
    if (currentIndex < images.length - 1) {
      const nextImg = new Image()
      nextImg.src = images[currentIndex + 1].url
      preloadImages.push(nextImg)
    }

    // Preload previous image
    if (currentIndex > 0) {
      const prevImg = new Image()
      prevImg.src = images[currentIndex - 1].url
      preloadImages.push(prevImg)
    }
  }, [currentIndex, images])

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
        <ModalImage
          key={currentImage._id || currentIndex}
          image={currentImage}
          currentIndex={currentIndex}
          totalImages={images.length}
        />
      </div>
    </div>
  )
}

// Componente interno para manejar el estado de carga de cada imagen
// Usar key prop para resetear estado automáticamente al cambiar imagen
function ModalImage({
  image,
  currentIndex,
  totalImages
}: {
  image: { url: string; filename: string; blurUrl?: string; _id?: string }
  currentIndex: number
  totalImages: number
}) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <>
      {/* Blur placeholder mientras carga la imagen */}
      {!imageLoaded && image.blurUrl && (
        <img
          src={image.blurUrl}
          alt=''
          className={styles.blurPlaceholder}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'blur(20px)',
            transform: 'scale(1.1)'
          }}
        />
      )}
      <img
        src={image.url}
        alt={image.filename}
        className={styles.image}
        onLoad={() => setImageLoaded(true)}
        style={{
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
      <div className={styles.imageInfo}>
        <span className={styles.imageCounter}>
          {currentIndex + 1} / {totalImages}
        </span>
      </div>
    </>
  )
}

export default GalleryModal
