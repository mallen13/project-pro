import React from 'react';
import styles from './List.module.css';

const ListView = ({
    list,
    deleteList,
    isRemovingList,
    deleteListItem,
    isRemovingListItems,
    inputRef,
    setInputVal,
    addItem,
    isAdding,
}) => (
    <div className={styles.listContainer}>
        {/* Title / Delete Button */}
        <div className={styles.listTitle}>
            <h3>{list.title}</h3>
            <button 
                aria-label='delete list'
                onClick={deleteList}
                disabled={isRemovingList ? true : false}
            >
                {isRemovingList ? 'Removing' : 'x'}
            </button>
        </div>

        {/* List Items */}
        {list.items.map( (listItem,index) => (
            <div className={styles.listItem} key={index} >
                <p>{listItem}</p>
                <button 
                    aria-label='delete list item'
                    onClick={ ()=> deleteListItem(listItem,index)}
                    disabled={isRemovingListItems.includes(index)  ? true : false}
                >
                    {isRemovingListItems.includes(index) ? 'Removing' : 'x'}
                </button>
            </div>
        ))}

        {/* Add Item */}
        <div className={styles.newItemContainer}>
            <input 
                aria-label='new list item input'
                ref={inputRef} 
                placeholder='Add an Item' 
                onChange={e => setInputVal(e.target.value)}/>
            <button onClick={addItem} disabled={isAdding ? true : false}>
                {!isAdding
                    ? 'Add'
                    : 'Adding'
                }               
            </button>
        </div>
    </div>
)

export default ListView