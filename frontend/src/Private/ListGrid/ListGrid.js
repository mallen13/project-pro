import { useState } from 'react';
import styles from './ListGrid.module.css';
import List from '../List/List';
import Toast from '../../Toast/Toast';

const ListGrid = ({
    lists,
    setLists,
    token,
    setUser,
    setParentAlert
}) => {

    //state
    const [toast,setToast] = useState({display: 'none', message: ''});

    //map lists
    const mapLists = () => (
        lists.map( (list,i) => (
            <List 
                list={list}
                lists={lists}
                setLists={setLists}
                token={token}
                key={i}
                setToast={setToast}
                setUser={setUser}
                setParentAlert={setParentAlert}
            />
        ))
    )

    //list grid
    const listGrid = ()=> (
        <>
            {mapLists()}
            { lists.length < 3 ? null : 
                <>
                    <div className={styles.placeholderDiv}></div>
                    <div className={styles.placeholderDiv}></div>
                </>
            }
        </>
    )

    return(
        <>
            {/* change style depending on value of lists */}
            <div className={styles.listGrid}>
                {
                    //show lists or status of fetch
                    lists === 'fetching' ? 'Loading Lists...' : 
                        lists === 'no lists' ? <div style={{marginTop: '50px'}}><p>So much empty. Create a list to get started. &#x1F603;</p></div> : 
                        Array.isArray(lists) ? listGrid() :
                        'System error. Please try again later.'
                }
            </div>
            <Toast display={toast.display} message={toast.message} setDisplay={setToast} />
        </>
    )
}

export default ListGrid