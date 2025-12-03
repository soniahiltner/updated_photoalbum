import type { GalleryProps } from '../../types'
import Image from '../Image/Image'
import styles from './Gallery.module.css'

const Gallery = ({ images, album, favouritesOnly }: GalleryProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.galleryContainer}>
        {images?.map((image, index) => (
          <Image
            key={image._id}
            image={image}
            index={index} 
            handleOpenModal={() => {}}
            favouritesOnly={favouritesOnly}
            albumFilter={!!album}
            album={album}
          />  
       ))}
      </div>
    </div>
  )
}

export default Gallery 