import React, { useRef,useState } from 'react';
import { getStoredUser,postData } from '../../functions/functions';
import ListView from './ListView';
import Alert from '../../Alert/Alert';

const List = ({
    list,
    lists,
    setLists,
    setToast,
    token,
    setUser,
    setParentAlert
}) => {

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
       
        //post to server
        const url = 'https://mattallen.tech/list-app/delete-list';
        //const url = 'http://localhost:8080/list-app/delete-list';
        let post;

         //set loading after 1 second
        const timer = setTimeout( ()=> setIsRemovingList(true),1000);
        post = await postData({list: list},url,token);

        //after post request 
        if (post === 'success') {
            clearTimeout(timer);
            const listsClone = JSON.parse(JSON.stringify(lists));

            listsClone.forEach( (delList,i) => 
                delList.id === list.id ? listsClone.splice(i,1) : null
            )

            setLists(listsClone);
            setToast({display: 'flex', message: `Deleted List: ${list.title}`});

        } else if (post === 'invalid token') {
            const storedUser = await getStoredUser();
            if (storedUser !== 'no user')  {
                await setUser(storedUser);
                return deleteList();
            }
        
            setUser({aToken: null});
            setParentAlert({display: true, message: 'Login Expired. Please Sign In again.'});

        } else {
            setAlert({display: 'flex', message: 'System error. Please try again later.'})
        }   
        
        //stop loading
        setIsRemovingList(false);

   }

   //delete list item
   const deleteListItem = async (item,index) => {
        //set loading
       const timer = setTimeout( ()=> {
            setIsRemovingListItems( itemIndexes => [...itemIndexes,index]) 
        },1000);

        //post to server
        const url = 'https://mattallen.tech/list-app/delete-list-item';
        //const url = 'http://localhost:8080/list-app/delete-list-item';
        const post = await postData({listID: list.id,listItem: item},url,token);

        //after post request 
        if (post === 'success') {
            clearTimeout(timer);

            const deepClone = JSON.parse(JSON.stringify(lists));

            //remove item from list
            deepClone.forEach( listClone => {
                if (listClone.id === list.id) {
                    listClone.items.splice(index,1)
                }
            })
            setLists(deepClone);

            setToast({display: 'flex', message: `Removed item "${item}" from ${list.title}`});
        } else if (post === 'invalid token') {
            const storedUser = await getStoredUser();
            if (storedUser !== 'no user')  {
                await setUser(storedUser);
                return deleteListItem();
            }
        
            setUser({aToken: null});
            setParentAlert({display: true, message: 'Login Expired. Please Sign In again.'});
        } else {
            setAlert({display: 'flex', message: 'System error. Please try again later.'});
            inputRef.current.focus();
        }   
        
        //remove completed item from array
        setIsRemovingListItems( listItems => listItems.filter((_, index) => index !== 0));
   }

  //add item
  const addItem = async () => {

    //if blank
    if (inputVal === '') {
        setAlert({display: 'flex', message: 'Item cannot be blank.'})
        inputRef.current.focus();
        return null;
    }

    //set loading
    const timer = setTimeout( ()=> setIsAdding(true), 1000);

    //post to server
    const url = 'https://mattallen.tech/list-app/add-list-item';
    //const url = 'http://localhost:8080/list-app/add-list-item';
    const post = await postData({listID: list.id,listItem: inputVal},url,token);

    //after post request 
    if (post === 'success') {
        clearTimeout(timer);
        setToast({display: 'flex', message: `Added item "${inputVal}" to ${list.title}`});

        //modify list item
        const deepClone = JSON.parse(JSON.stringify(lists));
        deepClone.forEach( listClone => {
            if (listClone.id === list.id) listClone.items.push(inputVal);
        })
        setLists(deepClone);

        //reset input
        setInputVal('');
        inputRef.current.value = '';
    } else if (post === 'invalid token') {
        const storedUser = await getStoredUser();
            if (storedUser !== 'no user')  {
                await setUser(storedUser);
                return addItem();
            }
        
            setUser({aToken: null});
            setParentAlert({display: true, message: 'Login Expired. Please Sign In again.'});
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