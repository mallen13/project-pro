const express = require('express');
const app = express();
const cors = require('cors');
const port = 8080;

app.use(cors());
app.use(express.json());

let lists = [
    {
    title: 'to-do list',
    items: [
      'go to store',
      'watch tv'
    ]
    },
    {
    title: 'another list',
    items: [
      'do something',
      'do something else'
    ]
    }
]

//api status
app.get('/list-app/api/status', (req,res) => res.json('API is working! :)') )

//get lists
app.get('/list-app/api/get-lists', (req, res) => {
    //if not lists
    res.status(200).json({lists: lists})
    console.log('lists sent');
})

//create list
app.post('/list-app/api/create-list', (req, res) => {
    const { listTitle } = req.body;

    //post to dv
    if (lists.map( list => list.title).includes(listTitle)) {
      res.status(409).json('list already exists');
      return;
    }
    lists.push({
      title: listTitle,
      items: []
    })

    res.status(200).json('success');
    console.log(`"${listTitle}" created`);
})

//delete list
app.post('/list-app/api/delete-list', (req,res) => {
  const { listTitle } = req.body;
  
  //if list doesn't exist

  //remove from db
  const index = lists.map(obj => obj.title).indexOf(listTitle); 
  if (index === -1) lists = [];
  else lists.splice(index,1);

  //send response
  console.log(`"${listTitle}" deleted`);
  res.status(200).json('success');
})

//add list item
app.post('/list-app/api/add-list-item', (req,res) => {
  const { listTitle,listItem } = req.body;

  //post to db
  const index = lists.map(obj => obj.title).indexOf(listTitle); 
  if (lists[index].items.includes(listItem)) {
    res.status(409).json('list item already exists');
    return;
  }
  lists[index].items.push(listItem);

  res.status(200).json('success');
  console.log(`"${listItem}" added to list "${listTitle}"`);
})

//delete list items
app.post('/list-app/api/delete-list-item', (req,res) => {
  const { listTitle,listItem } = req.body;

  //if item doesn't exists

  //remove from db
  const listIndex = lists.map(obj => obj.title).indexOf(listTitle); 
  const itemIndex = lists[listIndex].items.indexOf(listItem);
  lists[listIndex].items.splice(itemIndex,1);
  res.status(200).json('success');
  console.log(`list item "${listItem}" removed from list "${listTitle}"`);
})

//listen
app.listen(port, () => {
  console.log(`List App backend listening on port ${port}`)
})