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
app.get('/api/status', (req,res) => res.json('API is working! :)') )

//get lists
app.get('/api/get-lists', (req, res) => {
    //post to db
    //send appropriate response
    res.status(200).json({lists: lists})
    console.log('list sent');
})

//create list
app.post('/api/create-list', (req, res) => {
    const { listTitle } = req.body;

    //send appropriate response
    if (lists.map( list => list.title).includes(listTitle)) {
      res.status(409).json('list already exists');
      return;
    }

    //post to db
    lists.push({
      title: listTitle,
      items: []
    })

    res.status(200).json('success');
    console.log('list created');
})

//delete list
app.post('/api/delete-list', (req,res) => {
  const { listTitle } = req.body;
  console.log(listTitle);
  
  //post to db
  const index = lists.map(obj => obj.title).indexOf(listTitle); 
  if (index === -1) lists = [];
  else lists.splice(index,1);

  //send response
  console.log('list deleted');
  res.status(200).json('success');
})

//add list item
app.post('/api/add-list-item', (req,res) => {
  const { listTitle,listItem } = req.body;

  const index = lists.map(obj => obj.title).indexOf(listTitle); 

  if (lists[index].items.includes(listItem)) {
    res.status(409).json('list item already exists');
    return;
  }

  lists[index].items.push(listItem);
  res.status(200).json('success');
  console.log('list item added');
})

//delete list items
app.post('/api/delete-list-item', (req,res) => {
  const { listTitle,listItem } = req.body;

  const listIndex = lists.map(obj => obj.title).indexOf(listTitle); 
  const itemIndex = lists[listIndex].items.indexOf(listItem);
  lists[listIndex].items.splice(itemIndex,1);
  res.status(200).json('success');
  console.log('list item removed');
})

app.listen(port, () => {
  console.log(`List App backend listening on port ${port}`)
})