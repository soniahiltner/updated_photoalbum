
import styles from './Pagination.module.css'

type PaginationProps = {
  pageNumber: number
  total: number
  setPageNumber: (page: number) => void
}

const Pagination = ({ pageNumber, total, setPageNumber }: PaginationProps) => {

  const prevPage = (pag: number) => {
    if (pag  > 1) {
      setPageNumber(pag - 1)
    }
  }

  const nextPage = (pag: number) => {
    if (pag < total) {
      setPageNumber(pag + 1)
    }
  }
  const firstPage = () => {
    setPageNumber(1)
  }
  const lastPage = () => {
    setPageNumber(total)
  }
  
  return (
    <div className={styles.pagination}>
      <div className={styles.paginationInfo}>
        {total === 1 && <span>Page 1</span>}
        {total > 1 && (
          <span>
            Page {pageNumber} of {total}
          </span>
        )}
      </div>
      <div className={styles.paginationBtns}>
        <button
          className={`${pageNumber === 1 ? styles.disabled : ''}`}
          onClick={() => prevPage(pageNumber)}
        >
          &lt;
        </button>

        {total > 2 && (
          <button
            className={`${pageNumber === 1 ? styles.disabled : ''}`}
            onClick={() => firstPage()}
          >
            First
          </button>
        )}

        {total > 2 && (
          <button
            className={`${
              pageNumber === total ? styles.disabled : styles.lastBtn
            }`}
            onClick={() => lastPage()}
          >
            Last
          </button>
        )}

        <button
          className={`${pageNumber === total ? styles.disabled : ''}`}
          onClick={() => nextPage(pageNumber)}
        >
          &gt;
        </button>
      </div>
    </div>
  )
}

export default Pagination
