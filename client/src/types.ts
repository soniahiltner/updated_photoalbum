type Image = {
  _id?: string
  filename: string
  url: string
  thumbnailUrl?: string
  mediumUrl?: string
  blurUrl?: string
  isFavourite: boolean
  albums?: string[]
}

type AlbumType = {
  _id?: string
  name: string
}

type PaginatedResponse = {
  images: Image[]
  page: number
  totalPages: number
  count: number
}

//Form validator types
type ValidationError = {
  type: 'size' | 'type' | 'count'
  message: string
}

type validAlbumName = {
  type: 'length' | 'duplicate'
  message: string
}

// Components props types
type GalleryProps = {
  images: Image[]
  album?: AlbumType
  favouritesOnly?: boolean
}

type ImageProps = {
  image: Image
  index: number
  handleOpenModal: (index: number) => void
  favouritesOnly?: boolean
  albumFilter?: boolean
  album?: AlbumType
}

type IconsProps = {
  image: Image
  favouritesOnly?: boolean
  albumFilter?: boolean
  album?: AlbumType
}

type AddToAlbumFormProps = {
  image: Image
  setOpenSelect: (open: boolean) => void
}

type DeleteImageIconProps = {
  image: Image
  album?: AlbumType
}

type TooltipProps = {
  text: string
  position: 'top' | 'bottom' | 'bottomLeft'
}

type GalleryModalProps = {
  images: Image[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export type {
  Image,
  AlbumType,
  PaginatedResponse,
  ValidationError,
  validAlbumName,
  GalleryProps,
  ImageProps,
  AddToAlbumFormProps,
  IconsProps,
  DeleteImageIconProps,
  GalleryModalProps,
  TooltipProps
}
