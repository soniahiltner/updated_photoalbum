import type { IconsProps } from '../../types'
import DeleteImageIcon from '../DeleteImageIcon/DeleteImageIcon'
import FavouriteIcon from '../FavouriteIcon/FavouriteIcon'
import styles from './Icons.module.css'

const Icons = ({ image, favouritesOnly, albumFilter, album }: IconsProps) => {
  return <div className={styles.icons}>
    {favouritesOnly && <FavouriteIcon image={image} />}
    {albumFilter && (
      <div>
        <FavouriteIcon image={image} />
        <DeleteImageIcon image={image} album={album} />
      </div>
    )}
    {!favouritesOnly && !albumFilter && (
      <>
        <FavouriteIcon image={image} />
        <DeleteImageIcon image={image} /> 

      </>
      )}
  </div>
}

export default Icons