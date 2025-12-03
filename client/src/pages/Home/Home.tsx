import { imageService } from '../../api/images'
import Gallery from '../../components/Gallery/Gallery'
import type { Image } from '../../types'
import styles from './Home.module.css'
import { useQuery } from '@tanstack/react-query'

const Home = () => {
  // Queries
  const { data } = useQuery({
    queryKey: ['images'],
    queryFn: () => imageService.getImages(1)
  })
  const images: Image[] = data?.images || []
  return (
    <div>
      <div className={styles.home}>
        <div className={styles.imageGrid}>
          {images.length > 0 && <Gallery images={images} />}
        </div>
      </div>
    </div>
  )
}

export default Home
