import styles from './FavouriteIcon.module.css'
import type { Image } from '../../types'
import { useFavourite } from '../../hooks/useFavourite'

const FavouriteIcon = ({ image }: { image: Image }) => {
  const { toggleFavourite, isLoading } = useFavourite()

  const handleClick = () => {
    if (!image._id) return
    toggleFavourite(image._id, image.isFavourite)
  }

  return (
    <span
      className={`${image.isFavourite ? styles.favStar : styles.noFav} ${
        isLoading ? styles.loading : ''
      }`}
      onClick={handleClick}
      style={{ cursor: isLoading ? 'wait' : 'pointer' }}
    >
      <i className='fa fa-star'></i>
    </span>
  )
}

export default FavouriteIcon
