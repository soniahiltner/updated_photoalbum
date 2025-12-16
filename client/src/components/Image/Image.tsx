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
  return (
    <div className={styles.imgContainer}>
      <img
        src={image?.url}
        alt={image.filename}
        onClick={() => handleOpenModal(index)}
        tabIndex={0}
        
        decoding='async'
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
