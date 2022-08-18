import { useState } from 'react';
import styles from './Header.module.css';
import { List } from 'react-bootstrap-icons'


const Header = ({user,setLists,setUser}) => {
  
  const [menuIsOpen,setMenuIsOpen] = useState(false);

  const toggleMenu = () => menuIsOpen ? setMenuIsOpen(false) : setMenuIsOpen(true)

  return (
    <header>
      <button className='menuBtn' onClick={toggleMenu} aria-label='menu button'>
        <List size='45' />
      </button>
      <div className={styles.menuContainer} style={{opacity: menuIsOpen ? 1 : 0}}>
        <p>{user.name}</p>
        <p>{user.email}</p>
        <button onClick={ ()=> {setUser(null); setLists([])} }>Sign Out</button>
      </div>
    </header>
  )
}

export default Header