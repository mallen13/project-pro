import { useState } from 'react';
import { postData } from '../../functions/functions';
import styles from './Header.module.css';
import { List } from 'react-bootstrap-icons'


const Header = ({user,setLists,setUser}) => {
  
  const [menuIsOpen,setMenuIsOpen] = useState(false);

  const toggleMenu = () => menuIsOpen ? setMenuIsOpen(false) : setMenuIsOpen(true);

  const signOut = async () => {
    //remove stored token and tokens delete from DB
    const url = 'https://mattallen.tech/list-app/logout'; 
    await postData({id: user.id},url);
    localStorage.removeItem('list-app-user');
    setUser({aToken: null});
    setLists([]);
  }

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
          <button onClick={signOut}>Sign Out</button>
        </div>
    </header>
  )
}

export default Header