import AlbumsList from "../../components/AlbumsList/AlbumsList"
import CreateAlbumForm from "../../components/CreateAlbumForm/CreateAlbumForm"


const Albums = () => {
  return (
    <div className={'main'}>
      <CreateAlbumForm />
      <AlbumsList />
    </div>
  )
}

export default Albums