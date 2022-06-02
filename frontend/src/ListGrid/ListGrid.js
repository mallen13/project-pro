import { useState } from 'react';
import styles from './ListGrid.module.css';
import List from '../List/List';
import Toast from '../Toast/Toast';

const ListGrid = ({lists,setLists}) => {

    //state
    const [toast,setToast] = useState({display: 'none', message: ''});

    //map lists
    const mapLists = () => (
        lists.map( (list,i) => (
            <List 
                list={list}
                setLists={setLists}
                key={i}
                setToast={setToast}
            />
        ))
    )

    return(
        <>
            {/* change style depending on value of lists */}
            <div className={Array.isArray(lists) && lists.length > 1 ? styles.listGrid: styles.noGrid}>
                {
                    //show lists or status of fetch
                    lists === 'fetching' ? 'Loading Lists...' : 
                        lists === 'no lists' ? 'No Lists' : 
                        Array.isArray(lists) ? mapLists() : 'System error. Please try again later.'
    
                }
            </div>
            <Toast display={toast.display} message={toast.message} setDisplay={setToast} />
        </>
    )
}

export default ListGrid