import styles from './AddToAlbumIcon.module.css'

import AddToAlbumForm from '../AddToAlbumForm/AddToAlbumForm'
import { useState } from 'react'
import type { Image } from '../../types'


const AddToAlbumIcon = ({ image }: { image: Image }) => {
  const [openSelect, setOpenSelect] = useState(false)

  const openSelectModal = () => {
    setOpenSelect(true)
  }


  return (
    <div className={styles.addToAlbumContainer}>
      <span
        className={styles.addToAlbum}
        onClick={openSelectModal}
      >
        <i className='fa fa-folder-plus'></i>
      </span>
      
      {openSelect && (
        <AddToAlbumForm
          image={image}
          setOpenSelect={setOpenSelect}
        />
      )}
    </div>
  )
}

export default AddToAlbumIcon
