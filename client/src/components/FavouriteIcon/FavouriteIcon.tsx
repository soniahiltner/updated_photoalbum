
import styles from './FavouriteIcon.module.css'
import type { Image } from '../../types'

const FavouriteIcon = ({ image }: { image: Image }) => {
  
  const isFavourite = image.isFavourite


  return (
    <span
      className={`${isFavourite ? styles.favStar : styles.noFav}`}
    >
      <i className='fa fa-star'></i>
      
    </span>
  )
}

export default FavouriteIcon
