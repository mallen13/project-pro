import { useRef,useState } from 'react';
import { postData } from '../functions/functions';
import NewListInputView from './newListinputView';
import Alert from '../Alert/Alert';
import Toast from '../Toast/Toast';

const NewListInput = ({lists,setLists}) => {

    //ref
    const inputRef = useRef();

    //state
    const [input,setInput] = useState('');
    const [isLoading,setIsLoading] = useState(false);
    const [alert,setAlert] = useState({display: 'none', message: ''});
    const [toast,setToast] = useState({display: 'none', message: ''});

    //add new list
    const addList = async () => {
        setIsLoading(true);

        //validation
        if (input === '') {
            setAlert({display: true, message: 'Cannot be blank.'})
            setIsLoading(false);
            inputRef.current.focus();
            return;
        }

        //if list title already exists
        if (Array.isArray(lists) && lists.map( list => list.title).includes(input)) {
            setIsLoading(false);
            setAlert({display: true, message: 'List already exists'});
            return;
        }

        //post to server
        //const url = 'https://mattallen.tech/list-app/create-list';
        const url = 'http://localhost:8080/list-app/create-list';

        let { listId } = await postData({listTitle: input}, url);
         
        //after post
        if (listId) {
            setToast({display: 'flex', message: 'List Added'});

            const newList = {id: listId, title: input, items: []};
            setLists( prevState => 
                Array.isArray(prevState) 
                    ? [...prevState,newList] 
                    : [newList]
            );

            inputRef.current.value = '';
            setInput('');
        } else {
            setAlert({display: true, message: 'System error. Please try again later.'})
        }

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