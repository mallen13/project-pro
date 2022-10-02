import { useRef,useState } from 'react';
import { getStoredUser,postData } from '../../functions/functions';
import NewListInputView from './newListinputView';
import Alert from '../../Alert/Alert';
import Toast from '../../Toast/Toast';

const NewListInput = ({lists,setLists,token,setUser,setParentAlert}) => {
    //ref
    const inputRef = useRef();

    //state
    const [input,setInput] = useState('');
    const [isLoading,setIsLoading] = useState(false);
    const [alert,setAlert] = useState({display: 'none', message: ''});
    const [toast,setToast] = useState({display: 'none', message: ''});

    //add new list
    const addList = async () => {
        //validation
        if (input === '') {
            setAlert({display: true, message: 'Cannot be blank.'})
            inputRef.current.focus();
            return;
        }

        //if list title already exists
        if (Array.isArray(lists) && lists.map( list => list.title).includes(input)) {
            setAlert({display: true, message: 'Project already exists'});
            return;
        }

        //post to server
        const url = 'https://mattallen.tech/list-app/create-list';
        //const url = 'http://localhost:8080/list-app/create-list';

        const timer = setTimeout( ()=> setIsLoading(true), 1000);
        
        let data = await postData({listTitle: input}, url,token);
        //after post
        if (data.listId) {
            setToast({display: 'flex', message: 'Project Added'});

            //set lists
            const newList = {id: data.listId, title: input, items: []};
            const newListArr = Array.isArray(lists) ? [...lists,newList] : [newList];
            setLists(newListArr);

            //clear input
            inputRef.current.value = '';
            setInput('');
            
        } else if (data === 'invalid token') {
            const storedUser = await getStoredUser();
            if (storedUser !== 'no user')  {
                await setUser(storedUser);
                return addList();
            }
            setUser({aToken: null});
            setParentAlert({display: 'flex', message: 'Login Expired. Please Sign In again.'});
        } else {
            setAlert({display: 'flex', message: 'System error. Please try again later.'});
        }
        
        clearTimeout(timer);
        setIsLoading(false);
       
      }

    return (
        <>
        <NewListInputView 
            addList={addList}
            setInput={setInput}
            inputRef={inputRef}
            isLoading={isLoading}
        />
        <Alert display={alert.display} message={alert.message} setDisplay={setAlert} focusRef={inputRef}/>
        <Toast display={toast.display} message={toast.message} setDisplay={setToast} />
        </>
    )
}

export default NewListInput;