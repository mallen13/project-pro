import { useState } from 'react';
import styles from './Header.module.css';
import { List } from 'react-bootstrap-icons'


const Header = ({user,setLists,setUser}) => {
  
  const [menuIsOpen,setMenuIsOpen] = useState(false);

  const toggleMenu = () => menuIsOpen ? setMenuIsOpen(false) : setMenuIsOpen(true)

  return (
    <header>
        {/* Button */}
        <button className='menuBtn' onClick={toggleMenu} aria-label='menu button'>
          <List size='45' />
        </button>

        {/* Menu */}
        <div className={styles.menuContainer} style={{display: menuIsOpen ? 'flex' : 'none'}}>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <button onClick={ ()=> {setUser(null); setLists([])} }>Sign Out</button>
        </div>
    </header>
  )
}

export default Header