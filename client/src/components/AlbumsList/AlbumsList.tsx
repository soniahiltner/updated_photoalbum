
import { useQuery } from '@tanstack/react-query'
import AlbumListItem from '../AlbumListItem/AlbumListItem'
import styles from './AlbumsList.module.css'
import { albumsQueryOptions } from '../../queryOptions/imagesQueryOptions'

const AlbumsList = () => {
  
  const { data: albums } = useQuery(albumsQueryOptions())

  return (
    <div className={styles.albumsList}>
      {albums?.map((album) => (
        <AlbumListItem
          key={album._id}
          album={album}
        />
      ))}
      <p></p>
    </div>
  )
}

export default AlbumsList
