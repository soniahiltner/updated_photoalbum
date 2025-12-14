import { useState } from 'react'
import type { AlbumType } from '../../types'
import styles from './DeleteAlbumIcon.module.css'
import Tooltip from '../Tooltip/Tooltip'
import { useDeleteAlbum } from '../../hooks/useDeleteAlbum'

const DeleteAlbumIcon = ({ album }: { album: AlbumType }) => {
  const [hovering, setHovering] = useState(false)
  const { deleteAlbum, isLoading } = useDeleteAlbum()

  const handleDelete = () => {
    if (!isLoading) {
      deleteAlbum(album.name)
    }
  }

  const mouseOver = () => setHovering(true)
  const mouseOut = () => setHovering(false)

  return (
    <button
      className={`icon ${styles.binButton} ${isLoading ? styles.loading : ''}`}
      onClick={handleDelete}
      onMouseOver={mouseOver}
      onMouseOut={mouseOut}
    >
      <i className={isLoading ? 'fa fa-spinner fa-spin' : 'fa fa-trash'}></i>
      {hovering && (
        <Tooltip
          text={isLoading ? 'Deleting...' : 'Delete'}
          position='top'
        />
      )}
    </button>
  )
}

export default DeleteAlbumIcon
