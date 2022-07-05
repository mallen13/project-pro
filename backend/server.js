const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const { 
  getLists, 
  createList, 
  deleteList,
  addListItem,
  deleteListItem
} = require('./controller');
const port = 8080;

app.use(cors());
app.use(express.json());

//setup DB
// const pool = mysql.createPool({
//   host : '127.0.0.1',
//   user : 'root',
//   password: 'Drummer90!',
//   database: 'list_app'
// });

const pool = mysql.createPool({
  host : '127.0.0.1',
  user : process.env.DB_USER,
  password: process.env.DB_PW,
  database: 'mattallen_list_app'
});

const promisePool = pool.promise();

// const client = new Client({
//   user: process.env.DB_Uname, 
//   host: '127.0.0.1',
//   port: 5432,
//   database: 'mattallen_favs', 
//   password: process.env.DB_PW
// });

//api status
app.get('/list-app/status', (req,res) => res.json('API is working! :)') )

//get lists
app.get('/list-app/get-lists', async (req,res) => {
    try {
      res.status(200).json({lists: await getLists(promisePool)});
    } catch (err) {
      console.error(err.message)
      res.status(500).json({status: err.message});
    }  
})

//create list
app.post('/list-app/create-list', async (req, res) => {
    const { listTitle } = req.body;

     try {
      await createList(promisePool,listTitle);
      res.status(201).json('success');
    } catch (err) {
      console.error(err.message)
      res.status(500).json({status: err.message});
    }  
})

//delete list
app.post('/list-app/delete-list', async (req,res) => {
  const { listID, hasItems } = req.body;

  try {
   await deleteList(promisePool,listID,hasItems);
   res.status(200).json('success');
  } catch (err) {
    console.error(err.message)
    res.status(500).json({status: err.message});
  }  

})

//add list item
app.post('/list-app/add-list-item', async (req,res) => {
  const { listID,listItem } = req.body;
  
    try {
      await addListItem(promisePool,listID,listItem);
      res.status(200).json('success');
    } catch (err) {
      console.error(err.message)
      res.status(500).json({status: err.message});
    }
})

//delete list items
app.post('/list-app/delete-list-item', async (req,res) => {
  const { listID,listItem } = req.body;

  try {
    await deleteListItem(promisePool,listID,listItem);
    res.status(200).json('success');
  } catch (err) {
    console.error(err.message)
    res.status(500).json({status: err.message});
  }

})

//listen
app.listen( port, ()=> console.log('App is listening...'));