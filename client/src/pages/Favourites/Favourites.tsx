//import Gallery from '../../components/Gallery/Gallery'
import { useInfiniteQuery } from '@tanstack/react-query'
import styles from './Favourites.module.css'
import { favouritesInfiniteQueryOptions } from '../../queryOptions/imagesQueryOptions'
import type { Image } from '../../types'
import Gallery from '../../components/Gallery/Gallery'
import { useEffect, useRef } from 'react'

const Favourites = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(favouritesInfiniteQueryOptions())

  // Flatten all pages into a single array
  const images: Image[] = data?.pages.flatMap((page) => page.images) || []

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

  return (
    <div className={styles.favourites}>
      {images.length > 0 && (
        <Gallery
          images={images}
          favouritesOnly={true}
        />
      )}
      {/* Observer target for infinite scroll */}
      <div
        ref={observerTarget}
        style={{ height: '20px' }}
      />
      {isFetchingNextPage && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <i
            className='fa fa-spinner fa-spin'
            style={{ fontSize: '24px' }}
          ></i>
        </div>
      )}
    </div>
  )
}

export default Favourites
