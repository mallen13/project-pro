import { useEffect,useState } from 'react';
import { getData } from './functions/functions';
import styles from './App.module.css';
import ListGrid from './ListGrid/ListGrid';
import NewListInput from './NewListInput/NewListInput';

function App() {

  //state
  const [lists,setLists] = useState([]);

  useEffect( ()=> {
    const fetchData = async () => {
      //const url = 'https://mattallen.tech/list-app/get-lists';
      const url = 'http://localhost:8080/list-app/get-lists';
      let data;

      //show loading after 1 second
      setTimeout( ()=> !data  ? setLists('fetching') : null ,1000);

      data = await getData(url);

      if (!data.lists) {
        setLists('error');
        return;
      }
      if (data.lists.length > 0) setLists(data.lists);
      if (data.lists.length === 0) setLists('no lists');
    }

    if (lists === 'fetching' || lists.length === 0) fetchData();
  
  },[lists])

  //return
  return (
    <div className={styles.gridContainer}>
      <h1 style={{marginBottom: '10px'}}>List App</h1>
      <NewListInput lists={lists} setLists={setLists} />
      <ListGrid lists={lists} setLists={setLists} />
    </div>
  );
}

export default App;
