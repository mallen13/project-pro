import { useEffect,useState } from 'react';
import { getData } from './functions/functions';
import styles from './App.module.css';
import Alert from './Alert/Alert';
import LoginPage from './Public/LoginPage';
import Header from './Private/Header/Header';
import ListGrid from './Private/ListGrid/ListGrid';
import NewListInput from './Private/NewListInput/NewListInput';

function App() {

  //state
  const [alert, setAlert] = useState({display: 'none', message: ''})
  const [lists,setLists] = useState([]);
  const [user,setUser] = useState(null);

  //use effect 
   //check for jwt, set isAuth
   //context for user?


  useEffect( ()=> {
    //check for token

    //fetch lists
    const fetchData = async () => {
      const url = 'https://mattallen.tech/list-app/get-lists';
      //const url = 'http://localhost:8080/list-app/get-lists';
      let data;

      //show loading after 1 second
      setTimeout( ()=> !data  ? setLists('fetching') : null ,1000);

      data = await getData(url,user.token);

      //if bad token, remove user
      if (data === 'invalid token') {
        setAlert({display: 'flex', message: 'Login Expired. Please Sign In again.'})
        setUser(null);
      }

      if (!data.lists) {
        setLists('error');
        return;
      }
      if (data.lists.length > 0) setLists(data.lists);
      if (data.lists.length === 0) setLists('no lists');
    }
    
    //if token, fetch lists
    if (user)
      if (lists === 'fetching' || lists.length === 0) fetchData();
  
  },[lists,user])

  //return
  return (
    !user
      ? 
        <>
           <Alert 
            display={alert.display} 
            setDisplay={setAlert} 
            message={alert.message} 
          />
          <LoginPage setUser={setUser} />
        </>
      : <>
          <Header user={user} setUser={setUser} setLists={setLists} />
          <div className={styles.gridContainer}>
            <div className={styles.placeholderLogo  }></div>
            <h1 style={{marginBottom: '10px'}}>List App</h1>
            <NewListInput 
              lists={lists} 
              token={user.token} 
              setLists={setLists} 
              setUser={setUser}
              setParentAlert={setAlert}
            />
            <ListGrid 
              lists={lists} 
              setLists={setLists} 
              token={user.token}
              setUser={setUser}
              setParentAlert={setAlert} />
          </div>
        </>
    );
}

export default App;
