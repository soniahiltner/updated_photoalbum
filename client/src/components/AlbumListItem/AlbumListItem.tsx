import styles from './AlbumListItem.module.css'

import { Link } from 'react-router'

import { useQuery } from '@tanstack/react-query'
import { imageService } from '../../api/images'
import type { AlbumType } from '../../types'
import DeleteAlbumIcon from '../DeleteAlbumIcon/DeleteAlbumIcon'

const AlbumListItem = ({ album }: { album: AlbumType }) => {
  // Get last image for each album
  const { data } = useQuery({
    queryKey: ['albumLastImage', album.name],
    queryFn: () => imageService.getAlbumLastImage(album.name)
  })
  const image = data || null

  return (
    <div className={styles.albumContainer}>
      <div className={styles.header}>
        <h2>{album.name}</h2>
        <DeleteAlbumIcon album={album} />
      </div>

      {!image && (
        <div className={styles.emptyAlbum}>
          <span>Empty album</span>
        </div>
      )}
      {image && (
        <Link to={`/albums/${album._id}`}>
          <div className={styles.albumImageLink}>
            <img src={image.url} alt={`Last image of album ${album.name}`} />
          </div>
        </Link>
      )}
    </div>
  )
}

export default AlbumListItem
