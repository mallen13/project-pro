import React, { useRef,useState } from 'react';
import { postData } from '../functions/functions.js';
import ListView from './ListView';
import Alert from '../Alert/Alert';

const List = ({list,setLists,setToast}) => {

  //ref
  const inputRef = useRef();

  //state
  const [inputVal,setInputVal] = useState('');
  const [isAdding,setIsAdding] = useState(false);
  const [isRemovingList,setIsRemovingList] = useState(false);
  const [isRemovingListItems,setIsRemovingListItems] = useState([]);
  const [alert,setAlert] = useState({display: 'none', message: ''});
  

   //delete list
   const deleteList = async () => {
        //set loading
        setIsRemovingList(true);

        //post to server
        const url = 'https://mattallen.tech/list-app/delete-list';
        //const url = 'http://localhost:8080/list-app/delete-list';
        const post = await postData({list: list},url)

        //after post request 
        if (post === 'success') {
            setLists('fetching');
            setToast({display: 'flex', message: `Deleted List: ${list.title}`});
        } else {
            setAlert({display: 'flex', message: 'System error. Please try again later.'})
        }   
        
        //stop loading
        setIsRemovingList(false);

   }

   //delete list item
   const deleteListItem = async (item,index) => {
        //set loading
        setIsRemovingListItems( oldArr => [...oldArr,index] );

        //post to server
        const url = 'https://mattallen.tech/list-app/delete-list-item';
        //const url = 'http://localhost:8080/list-app/delete-list-item';
        const post = await postData({listID: list.id,listItem: item},url);

        //after post request 
        if (post === 'success') {
            setLists('fetching');
            setToast({display: 'flex', message: `Removed item "${item}" from ${list.title}`});
        } else {
            setAlert({display: 'flex', message: 'System error. Please try again later.'});
            inputRef.current.focus();
        }   
        
        //remove completed item from array
        setIsRemovingListItems( listItems => listItems.filter((_, index) => index !== 0));

   }

  //add item
  const addItem = async () => {

    //validate input
    if (inputVal === '') {
        setAlert({display: 'flex', message: 'Item cannot be blank.'})
        inputRef.current.focus();
        return null;
    }

    //if list title already exists
    if (list.items.includes(inputVal)) {
        setAlert({display: true, message: 'List item already exists'});
        return;
    }

    //set loading
    setIsAdding(true);

    //post to server
    const url = 'https://mattallen.tech/list-app/add-list-item';
    //const url = 'http://localhost:8080/list-app/add-list-item';
    const post = await postData({listID: list.id,listItem: inputVal},url);

    //after post request 
    if (post === 'success') {
        setToast({display: 'flex', message: `Added item "${inputVal}" to ${list.title}`});
        setLists('fetching');
        inputRef.current.value = '';
    } else {
        setAlert({display: 'flex', message: 'System error. Please try again later.'})
        inputRef.current.focus();
    }   
    
    //stop loading
    setIsAdding(false);
  }

  return (
    <>
    <ListView 
        list={list}
        deleteList={deleteList}
        isRemovingList={isRemovingList}
        deleteListItem={deleteListItem}
        isRemovingListItems={isRemovingListItems}
        inputRef={inputRef}
        setInputVal={setInputVal}
        addItem={addItem}
        isAdding={isAdding}
    />
    <Alert display={alert.display} message={alert.message} setDisplay={setAlert} focusRef={inputRef} />
    
    </>
  )
}

export default List