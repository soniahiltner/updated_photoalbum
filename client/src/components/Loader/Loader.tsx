import styles from './Loader.module.css'

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <i
        className={`fa fa-spinner fa-spin ${styles.spinner}`}
        aria-hidden='true'
      ></i>
    </div>
  )
}

export default Loader