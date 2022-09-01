const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const rateLimit = require('express-rate-limit')

const {
  authenticateToken,
  isValidEmail} = require('./helpers');
const bcrypt  = require("bcrypt");
const jwt = require('jsonwebtoken');
const { 
  createUser,
  findUser,
  getLists, 
  createList, 
  deleteList,
  addListItem,
  deleteListItem
} = require('./dbController');

app.use(cors());
app.use(express.json());

//rate limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 60 minutes
	max: 50, // Limit each IP to 50 requests per 15 mins
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

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

  if (!user) return res.sendStatus((400))

  if (!user.email) 
    return res.status(400).json({status: 'invalid email'});

  //validate email
  if (!user.email || !isValidEmail(user.email)) 
    return res.status(400).json({status: 'invalid email'});

  //validate pw
  if (!user.password || user.password === '') 
    return res.status(400).json({status: 'invalid password'});

  //salt && hash password
  bcrypt.hash(user.password,10, async (err,hash) => {
    //if error
    if (err) {
      console.error(err);
      return res.status(500).json({status: 'error hashing password'});
    }

    //else, post to DB
    try {
      user.password = hash;
      await createUser(promisePool,user);
      return res.status(201).json('success');
    } catch(err) {
      console.error(err.message);
      res.status(500).json({status: err.message});
    }
  })
})

//authenticate user
app.post('/list-app/login', async (req,res) => {
  const { email,password } = req.body;
  //search for user
  try {
    const user = await findUser(promisePool,email);
    //if user exists
    if (user.length === 1) {

      //compare password input to hash
      bcrypt.compare(password, user[0].password, (err,isValid) => {
        if (err) return res.status(500).json({status: 'hash process error'});

        //return token if valid
        if (isValid) {
          const userPayload = {
            id: user[0].user_id,
            name: user[0].name,
            email: user[0].email
          }

          const token = jwt.sign(
            userPayload,
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: 10000}
          );
          return res.status(200).json({
            user: {name: user[0].name, email: user[0].email},
            accessToken: token
          }),3000;
        }
        
        if (!isValid) return res.status(500).json({status: 'invalid username or password'});

      })

    //if no user returned invalid 
    } else res.status(500).json({status: 'invalid username or password'})

  } catch (err) {
    res.status(500).json({status: err.message});
  }  
})

//get lists
app.get('/list-app/get-lists', authenticateToken, async (req,res) => {

    try {
      const fetchLists = await getLists(promisePool,req.user.id);
      res.status(200).json({lists: fetchLists});
    } catch (err) {
      console.error('message',err.message);
      res.status(500).json({status: err.message});
    }  
})

//create list
app.post('/list-app/create-list', authenticateToken, async (req, res) => {
    const { listTitle } = req.body;
     try {
      const { listId }  = await createList(promisePool,listTitle,req.user.id);
      res.status(201).json({listId: listId});
    } catch (err) {
      console.error(err.message)
      res.status(500).json({status: err.message});
    }  
})

//delete list
app.post('/list-app/delete-list', authenticateToken, async (req,res) => {
  const { list } = req.body;
  try {
   await deleteList(promisePool,list,req.user.id);
   res.status(200).json('success');
  } catch (err) {
    console.error(err.message);
    res.status(500).json({status: err.message});
  }  

})

//add list item
app.post('/list-app/add-list-item', authenticateToken, async (req,res) => {
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
app.post('/list-app/delete-list-item', authenticateToken, async (req,res) => {
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