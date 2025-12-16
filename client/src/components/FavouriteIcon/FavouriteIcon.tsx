import styles from './FavouriteIcon.module.css'
import type { Image } from '../../types'
import { useFavourite } from '../../hooks/useFavourite'
import { useIconHover } from '../../hooks/useIconHover'
import Tooltip from '../Tooltip/Tooltip'

const FavouriteIcon = ({ image }: { image: Image }) => {
  const { toggleFavourite, isLoading } = useFavourite()
  const { hovering, hoverHandlers } = useIconHover()

  const handleClick = () => {
    if (!image._id) return
    toggleFavourite(image._id, image.isFavourite)
  }

  return (
    <button
      className={`${image.isFavourite ? styles.favStar : styles.noFav} ${
        isLoading ? styles.loading : ''
      } icon` }
      onClick={handleClick}
      style={{ cursor: isLoading ? 'wait' : 'pointer' }}
      {...hoverHandlers}
      aria-label='Toggle Favourite'
    >
      <i className='fa fa-star'></i>
      {hovering && (
        <Tooltip
          text={image.isFavourite ? 'Is Favourite' : 'Not favourite'}
          position='bottom'
        />
      )}
    </button>
  )
}

export default FavouriteIcon
