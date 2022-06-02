import styles from './ListGrid.module.css';
import List from '../List/List';

const ListGrid = ({lists,setLists}) => {

    //map lists
    const mapLists = () => (
        lists.map( (list,i) => (
            <List 
            list={list}
            setLists={setLists}
            key={i}
            />
        ))
    )

    return(
        //change style depending on value of lists
        <div className={Array.isArray(lists) && lists.length > 1 ? styles.listGrid: styles.noGrid}>
            {
                //show lists or status of fetch
                lists === 'fetching' ? 'Loading Lists...'
                    : lists === 'no lists' ? 'No Lists'
                    : lists === 'error' ? 'System error. Please try again later.' 
                    : true ? mapLists() : null
            }
        </div>
    )
}

export default ListGrid