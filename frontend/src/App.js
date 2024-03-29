import { useEffect,useState } from 'react';
import { getData,getStoredUser } from './functions/functions';
import styles from './App.module.css';
import Alert from './Alert/Alert';
import LoginPage from './Public/LoginPage';
import Header from './Private/Header/Header';
import ListGrid from './Private/ListGrid/ListGrid';
import NewListInput from './Private/NewListInput/NewListInput';
import logo from './logo.png';

function App() {

  //state
  const [alert, setAlert] = useState({display: 'none', message: ''})
  const [lists,setLists] = useState([]);
  const [user, setUser] = useState( async ()=> {
    const storedUser = await getStoredUser();
    if (storedUser !== 'no user')
      setUser(storedUser);
  }); 

  //use effect 
  useEffect( ()=> {
    //fetch lists
    const fetchLists = async () => {
      const url = 'https://mattallen.tech/list-app/get-lists';
      //const url = 'http://localhost:8080/list-app/get-lists';
      let data;

      //show loading after 1 second
      setTimeout( ()=> !data  ? setLists('fetching') : null ,1000);

      data = await getData(url,user.aToken);

      //if bad token, remove user. not accessable currently
      // if (data === 'invalid token') {
      //   const storedUser = await getStoredUser();
      //   if (storedUser !== 'no user')  {
      //       setUser(storedUser);
      //       return fetchLists();
      //   }
      //   setUser({aToken: null});
      //   setAlert({display: 'flex', message: 'Login Expired. Please Sign In again.'});
      // }

      if (!data.lists) {
        setLists('error');
        return;
      }
      if (data.lists.length > 0) setLists(data.lists);
      if (data.lists.length === 0) setLists('no lists');
    }

    if (user.aToken) {
      if (lists === 'fetching' || lists.length === 0) fetchLists();
    }
  
  },[lists,user])

  //return
  return (
    !JSON.parse(localStorage.getItem('list-app-user')) && !user.aToken
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
            <div className={styles.logo}>
              <img src={logo} alt='Project Pro' />
            </div>
            <h1 style={{marginBottom: '10px'}}>Project Pro</h1>
            <p style={{marginBottom: '20px'}}>Create Projects. Add Tasks. Get Organized.</p>

            <NewListInput 
              lists={lists} 
              token={user.aToken} 
              setLists={setLists} 
              setUser={setUser}
              setParentAlert={setAlert}
            />
            <ListGrid 
              lists={lists} 
              setLists={setLists} 
              token={user.aToken}
              setUser={setUser}
              setParentAlert={setAlert} />
          </div>
        </>
    );
}

export default App;
