import { useState } from 'react';
import styles from './Header.module.css';


const Header = ({user,setLists,setUser}) => {
  
  const [menuIsOpen,setMenuIsOpen] = useState(false);

  const toggleMenu = () => menuIsOpen ? setMenuIsOpen(false) : setMenuIsOpen(true)

  return (
    <header>
      <button onClick={toggleMenu} aria-label='menu button'>Menu</button>
      <div className={styles.menuContainer} style={{display: menuIsOpen ? 'flex' : 'none'}}>
        <p>{user.name}</p>
        <p>{user.email}</p>
        <button onClick={ ()=> {setUser(null); setLists([])} }>Sign Out</button>
      </div>
    </header>
  )
}

export default Header