type Image = {
  _id?: string
  filename: string
  url: string
  isFavourite: boolean
  albums?: string[]
}

type Album = {
  _id?: string
  name: string
}

type PaginatedResponse = {
  images: Image[]
  page: number
  totalPages: number
  count: number
}

type GalleryProps = {
  images: Image[]
  album?: Album
  favouritesOnly?: boolean
}

type ImageProps = {
  image: Image
  index: number
  handleOpenModal: (index: number) => void
  favouritesOnly?: boolean
  albumFilter?: boolean
  album?: Album
}

type IconsProps = {
  image: Image
  favouritesOnly?: boolean
  albumFilter?: boolean
  album?: Album
}

type AddToAlbumFormProps = {
  image: Image
  setOpenSelect: (open: boolean) => void
}

type DeleteImageIconProps = {
  image: Image
  album?: Album
}

export type { Image, Album, PaginatedResponse, GalleryProps, ImageProps, AddToAlbumFormProps, IconsProps, DeleteImageIconProps }