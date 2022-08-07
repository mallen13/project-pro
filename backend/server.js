const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const {isValidEmail} = require('./helpers');
const bcrypt  = require("bcrypt");
const { 
  createUser,
  authenticate,
  getLists, 
  createList, 
  deleteList,
  addListItem,
  deleteListItem
} = require('./dbController');

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

//create user
app.post('/list-app/register', async (req,res) => {
  const { user } = req.body;

  //validate user
  if (!isValidEmail(user.email)) {
    console.log(user.email)
    res.status(400).json({status: 'invalid email'});
    return;
  }

  //validate pw (salt & hash)
  if (!user.password) {
    res.status(400).json({status: 'invalid password'});
    return;
  }

  //hash password
  bcrypt.hash(user.password,10, async (err,hash) => {
    //post to DB
    if (err) {
      console.error(err);
      res.status(500).json({status: 'error hashing password'});
      return;
    }

    user.password = hash;

    try {
      await createUser(promisePool,user);
      res.status(200).json('success');
    } catch(err) {
      console.error(err.message);
      res.status(500).json({status: err.message});
    }
  })
})

//authenticate user
app.post('/list-app/login', async (req,res) => {
  const { username,password } = req.body;

  //search for user
  try {
    const user = await authenticate(promisePool,username);

    let isErr = false;
    let errMsg;

    //if user exists
    if (user.length === 1) {

      //compare password input to hash
      bcrypt.compare(password, user[0].password, (err,isValid) => {
        if (err) res.status(500).json({status: 'hash process error'});

        if (isValid) res.status(200).json('success')
        
        if (!isValid) res.status(500).json({status: 'invalid username or password'});

      })

    //if no user returned invalid 
    } else res.status(500).json({status: 'invalid username or password'})

  } catch (err) {
    res.status(500).json({status: err.message});
  }  
})

//get lists
app.get('/list-app/get-lists', async (req,res) => {
    try {
      res.status(200).json({lists: await getLists(promisePool)});
    } catch (err) {
      console.error(err.message);
      res.status(500).json({status: err.message});
    }  
})

//create list
app.post('/list-app/create-list', async (req, res) => {
    const { listTitle,userID } = req.body;
     try {
      const { listId }  = await createList(promisePool,listTitle,userID);
      res.status(201).json({listId: listId});
    } catch (err) {
      console.error(err.message)
      res.status(500).json({status: err.message});
    }  
})

//delete list
app.post('/list-app/delete-list', async (req,res) => {
  const { list } = req.body;

  try {
   await deleteList(promisePool,list);
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
      console.error(err.message);
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
    console.error(err.message);
    res.status(500).json({status: err.message});
  }

})

//export for testing
module.exports = app;