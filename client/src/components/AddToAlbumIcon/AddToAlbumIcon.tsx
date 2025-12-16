import styles from './AddToAlbumIcon.module.css'
import AddToAlbumForm from '../AddToAlbumForm/AddToAlbumForm'
import { useState } from 'react'
import type { Image } from '../../types'
import Tooltip from '../Tooltip/Tooltip'
import { useIconHover } from '../../hooks/useIconHover'

const AddToAlbumIcon = ({ image }: { image: Image }) => {
  const [openSelect, setOpenSelect] = useState(false)
  const { hovering, hoverHandlers } = useIconHover()

  const openSelectModal = () => {
    setOpenSelect(true)
  }

  return (
    <>
      <button
        className={`icon ${styles.addToAlbumIcon}`}
        onClick={openSelectModal}
        {...hoverHandlers}
        aria-label='Add to Album'
      >
        <i className='fa fa-folder-plus'></i>
        {hovering && (
          <Tooltip
            text='Add to'
            position='bottom'
          />
        )}
      </button>

      {openSelect && (
        <AddToAlbumForm
          image={image}
          setOpenSelect={setOpenSelect}
        />
      )}
    </>
  )
}

export default AddToAlbumIcon
