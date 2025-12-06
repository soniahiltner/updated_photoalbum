import AlbumsList from "../../components/AlbumsList/AlbumsList"
import CreateAlbumForm from "../../components/CreateAlbumForm/CreateAlbumForm"
import styles from './Albums.module.css'


const Albums = () => {
  return (
    <div className={styles.albums}>
      <CreateAlbumForm />
      <AlbumsList />
    </div>
  )
}

export default Albums