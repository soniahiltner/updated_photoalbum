import { useParams } from 'react-router'
import Gallery from '../../components/Gallery/Gallery'
import {
  albumsQueryOptions,
  albumImagesInfiniteQueryOptions
} from '../../queryOptions/imagesQueryOptions'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import type { AlbumType } from '../../types'
import Loader from '../../components/Loader/Loader'
import { useEffect, useRef } from 'react'

const Album = () => {
  const { id } = useParams()

  const { data: albumsData } = useQuery(albumsQueryOptions())
  const albums: AlbumType[] = albumsData || []
  const album = albums.find((item) => item._id === id)

  // Get images for this specific album with infinite query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      ...albumImagesInfiniteQueryOptions(album?.name || ''),
      enabled: !!album?.name // Only fetch when album name is available
    })

  // Flatten all pages into a single array
  const images = data?.pages.flatMap((page) => page.images) || []

  // Intersection Observer for infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (isLoading) {
    return <Loader />
  }

  return (
    <main className={'main'} role='main'>
      <h1 style={{ textAlign: 'center' }}>{album?.name} </h1>
      {images.length > 0 && (
        <Gallery
          images={images}
          album={album}
        />
      )}
      {images.length === 0 && <p>No images in this album yet.</p>}
      {/* Observer target for infinite scroll */}
      {images.length > 0 && (
        <div
          ref={observerTarget}
          style={{ height: '20px' }}
        />
      )}
      {isFetchingNextPage && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <i
            className='fa fa-spinner fa-spin'
            style={{ fontSize: '24px' }}
          ></i>
        </div>
      )}
    </main>
  )
}

export default Album
