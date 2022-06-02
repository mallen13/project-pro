import { useEffect,useState } from 'react';
import { getData } from './functions/functions';
import styles from './App.module.css';
import ListGrid from './ListGrid/ListGrid';
import NewListInput from './NewListInput/NewListInput';

function App() {

  //state
  const [lists,setLists] = useState('fetching');

  useEffect( ()=> {
    const fetchData = async () => {
      //const url = 'https://mattallen.tech/list-app/api/get-lists';
      const url = 'http://localhost:8080/list-app/api/get-lists';
      const fetch = await getData(url);

      if (!fetch.lists) {
        setLists('error');
        return
      }
      if (fetch.lists.length > 0) setLists(fetch.lists);
      if (fetch.lists.length === 0) setLists('no lists');
    }

    if (lists === 'fetching') fetchData();
  
  },[lists])

  //return
  return (
    <div className={styles.gridContainer}>
      <h1>MyLists</h1>
      <NewListInput lists={lists} setLists={setLists} />
      <ListGrid lists={lists} setLists={setLists} />
    </div>
  );
}

export default App;
