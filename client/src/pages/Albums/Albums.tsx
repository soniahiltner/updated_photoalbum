import AlbumsList from "../../components/AlbumsList/AlbumsList"
import CreateAlbumForm from "../../components/CreateAlbumForm/CreateAlbumForm"


const Albums = () => {
  return (
    <main
      className={'main'}
      role='main'
    >
      <CreateAlbumForm />
      <AlbumsList />
    </main>
  )
}

export default Albums