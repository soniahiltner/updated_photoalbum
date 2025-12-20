import type { ImageProps } from '../../types'
import Icons from '../Icons/Icons'
import styles from './Image.module.css'

const Image = ({
  image,
  index,
  handleOpenModal,
  favouritesOnly,
  albumFilter,
  album
}: ImageProps) => {
  // Usar thumbnailUrl para galería, fallback a url si no está disponible
  const thumbnailUrl = image?.thumbnailUrl || image?.url
  const mediumUrl = image?.mediumUrl || image?.url
  const blurUrl = image?.blurUrl

  return (
    <div className={styles.imgContainer}>
      <img
        src={thumbnailUrl}
        srcSet={`${thumbnailUrl} 400w, ${mediumUrl} 800w`}
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        alt={image.filename}
        onClick={() => handleOpenModal(index)}
        tabIndex={0}
        loading='lazy'
        decoding='async'
        style={
          blurUrl
            ? {
                backgroundImage: `url(${blurUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }
            : undefined
        }
      />
      <Icons
        image={image}
        favouritesOnly={favouritesOnly}
        albumFilter={albumFilter}
        album={album}
      />
    </div>
  )
}

export default Image
