import { useState, useMemo } from 'react'
import type { GalleryProps, Image as ImageType } from '../../types'
import Image from '../Image/Image'
import GalleryModal from '../GalleryModal/GalleryModal'
import styles from './Gallery.module.css'

const Gallery = ({ images, album, favouritesOnly }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Distribute images into columns for masonry layout
  const columns = useMemo(() => {
    const columnCount = 3
    const cols: ImageType[][] = Array.from({ length: columnCount }, () => [])

    images?.forEach((image, index) => {
      cols[index % columnCount].push(image)
    })

    return cols
  }, [images])

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
        {columns.map((columnImages, columnIndex) => (
          <div
            key={columnIndex}
            className={styles.column}
          >
            {columnImages.map((image) => {
              const originalIndex = images.indexOf(image)
              return (
                <Image
                  key={image._id}
                  image={image}
                  index={originalIndex}
                  handleOpenModal={handleOpenModal}
                  favouritesOnly={favouritesOnly}
                  albumFilter={!!album}
                  album={album}
                />
              )
            })}
          </div>
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
