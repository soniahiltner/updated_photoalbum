import { useState } from 'react'
import type { GalleryProps } from '../../types'
import Image from '../Image/Image'
import GalleryModal from '../GalleryModal/GalleryModal'
import styles from './Gallery.module.css'

const Gallery = ({ images, album, favouritesOnly }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = (index: number) => {
    setCurrentIndex(index)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.galleryContainer}>
        {images?.map((image, index) => (
          <Image
            key={image._id}
            image={image}
            index={index}
            handleOpenModal={handleOpenModal}
            favouritesOnly={favouritesOnly}
            albumFilter={!!album}
            album={album}
          />
        ))}
      </div>

      {isModalOpen && (
        <GalleryModal
          images={images}
          currentIndex={currentIndex}
          onClose={handleCloseModal}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  )
}

export default Gallery
