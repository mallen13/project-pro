const express = require('express');
require('dotenv').config();
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
const pool = mysql.createPool({
  host : '127.0.0.1',
  user : process.env.DB_USER,
  password: process.env.DB_PW,
  database: 'mattallen_list_app'
});

const promisePool = pool.promise();

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

app.get('/test', async (req,res)=> {

  const deleteStatement = ' \
        DELETE list_items,list_names FROM list_items \
        LEFT OUTER JOIN list_names ON list_names.list_id = list_items.list_id \
        WHERE list_items.list_id = 65'

  //const deleteStatement = 'Select list_name from list_names WHERE list_id = 65'

  const sql = `SELECT IFNULL( (${deleteStatement}), 'no items' ) AS 'listName' `;

  const test = await promisePool.query(sql);
  // console.log(test);

  res.send(test)
} )

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