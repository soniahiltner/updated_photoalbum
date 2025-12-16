import { NavLink } from 'react-router'
import styles from './Navbar.module.css'
import UploadForm from '../UploadForm/UploadForm'

const Navbar = () => {

  const styleNavLink = ({ isActive }: { isActive: boolean }) => {
    return {
      color: isActive ? '#9d4400' : 'blueviolet'
    }
  }
  
  return (
    <div className={styles.navbar}>
      <nav>
        <div className={styles.navLinks} role='navigation'>
          <NavLink
            to={'/'}
            style={styleNavLink}
          >
            My Pictures
          </NavLink>
          <NavLink
            to={'/favourites'}
            style={styleNavLink}
          >
            My Favourites
          </NavLink>
          <NavLink
            to={'/albums'}
            style={styleNavLink}
          >
            My Albums
          </NavLink>
        </div>
      </nav>
      <UploadForm />
    </div>
  )
}

export default Navbar
