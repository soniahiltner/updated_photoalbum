import { useState } from 'react'
import type { GalleryProps } from '../../types'
import Image from '../Image/Image'
import styles from './Gallery.module.css'

const Gallery = ({ images, album, favouritesOnly }: GalleryProps) => {
  const [slideNumber, setSlideNumber] = useState(0)
  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = (index: number) => {
    setSlideNumber(index)
    setOpenModal(true)
  }
  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handlePrev = () => {
    if (slideNumber > 0) {
      setSlideNumber(slideNumber - 1)
    }
  }

  const handleNext = () => {
    if (slideNumber < images.length - 1) {
      setSlideNumber(slideNumber + 1)
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

      {/* modal */}
      {openModal && (
        <div className={styles.sliderContainer}>
          <span
            className={styles.closeBtn}
            onClick={handleCloseModal}
          >
            X
          </span>
          <span
            className={`${styles.prevBtn} ${
              slideNumber === 0 ? styles.disabled : ''
            }`}
            onClick={handlePrev}
          >
            <i className='fa fa-chevron-left'></i>
          </span>
          <span
            className={`${styles.nextBtn} ${
              slideNumber === images.length - 1 ? styles.disabled : ''
            }`}
            onClick={handleNext}
          >
            <i className='fa fa-chevron-right'></i>
          </span>

          <div className={styles.fullScreen}>
            <img src={images[slideNumber].url} />
            <div className={styles.imageCounter}>
              {slideNumber + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
