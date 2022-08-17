import { render,screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { mockFetch } from '../../functions/testHelpers';
import ListGrid from './ListGrid';

const listArr =  [
  {
  id: 1,
  title: 'to-do list',
  items: [
    'go to store',
    'watch tv'
  ]
  },
  {
  id: 2,
  title: 'another list',
  items: [
    'do something',
    'do something else'
  ]
  }
]

const makeList = () => listArr;

//get fetch before mock
const unmockedFetch = global.fetch;

//reset fetch after each
afterEach(()=> global.fetch = unmockedFetch);

describe('list grid', ()=> {

    it('renders lists', async () => {
        const listArr =  [
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

        //mock fetch
        mockFetch({lists: listArr});

        //render
        render(<ListGrid lists={listArr} />);

        //expect
        const todoList = await screen.findByText('to-do list');
        expect(todoList).toBeInTheDocument();
    });

    it('displays message on slow fetch', async () => {
      render(<ListGrid lists={'fetching'} />);

      //expect
      const loadMsg = await screen.findByText(/loading/i);
      expect(loadMsg).toBeInTheDocument();
  });
})

describe('list', ()=> {
  it('deletes a list', async () => {
   const listArr = makeList();

    //arrange
    mockFetch('success');
    render(<ListGrid lists={listArr} setLists={jest.fn()} />);

    //act
    const delBtn = screen.getAllByLabelText('delete list')[1];
    userEvent.click(delBtn);

    //assert
    const successMsg = await screen.findByText(/deleted list/i);
    expect(successMsg).toBeInTheDocument();
  });

  it('fetch error deleting list', async ()=> {
    const listArr = makeList();

    //arrange
    mockFetch('error');
    render(<ListGrid lists={listArr} setLists={jest.fn()} />);

    //act
    const delBtn = screen.getAllByLabelText('delete list')[0]
    userEvent.click(delBtn);

    //assert
    const errMsg = await screen.findByText(/system error/i);
    expect(errMsg).toBeInTheDocument();
  })

  it('adds list item', async ()=> {
    const listArr = makeList();

  //arrange
  mockFetch('success');

  render(<ListGrid lists={listArr} setLists={jest.fn()} />);

  //act
  const input = screen.getAllByLabelText('new list item input')[0];
  const addBtn = screen.getAllByText('Add')[0];
  userEvent.type(input,'do something');
  userEvent.click(addBtn);

  //assert
  await waitFor( ()=> {
    const successMsg = screen.getByText(/added item/i);
    expect(successMsg).toBeInTheDocument();
  }, {timeout: 3000})
  // const successMsg = await screen.findByText(/added item/i);
  // expect(successMsg).toBeInTheDocument();
  });

  it('message if adding blank item', async ()=> {
    const listArr = makeList();

    //arrange
    render(<ListGrid lists={listArr} setLists={jest.fn()} />);

    //act
    const addBtn = screen.getAllByText('Add')[0];
    userEvent.click(addBtn);
  
    //assert
    const errMsg = await screen.findByText(/cannot be blank/i);
    expect(errMsg).toBeInTheDocument();
 
  });

  it('fetch error adding list item', async ()=> {
    const listArr = makeList();

    //arrange
    mockFetch('error');
    render(<ListGrid lists={listArr} setLists={jest.fn()} />);

    //act
    const input = screen.getAllByLabelText('new list item input')[0];
    const addBtn = screen.getAllByText('Add')[0];
    userEvent.type(input,'item1');
    userEvent.click(addBtn);

    //assert
    const errAlert = await screen.findByText(/system error./i);
    expect(errAlert).toBeInTheDocument();
  })

  it('deletes list item', async ()=> {
    const listArr = makeList();

    //arrange
    mockFetch('success');
    render(<ListGrid lists={listArr} setLists={jest.fn()} />);

    //act
    const delBtn = screen.getAllByLabelText('delete list item')[0];
    userEvent.click(delBtn);

    //assert
    const successMsg = await screen.findByText(/removed item/i);
    expect(successMsg).toBeInTheDocument();

  });

  it('shows msg on delayed fetch remove list item', async ()=> {
    //arrange
    const listArr = makeList();
    render(<ListGrid lists={listArr} setLists={jest.fn()} />);

    global.fetch = () => new Promise( resolve => {
      setTimeout( ()=> {resolve( {json: ()=> Promise.resolve('success')})},1000)
    })

    //act
    const delBtn = screen.getAllByLabelText('delete list item')[0];
    userEvent.click(delBtn);

    //assert
    await waitFor( ()=> {
      const removeMsg = screen.getByText(/removed/i);
      expect(removeMsg).toBeInTheDocument();
    }, {timeout: 3000})

  });

  it('fetch error deleting list item', async ()=> {
    //arrange
    const listArr = makeList();
    mockFetch('error');
    render(<ListGrid lists={listArr} setLists={jest.fn()} />);

    //act
    const delBtn = screen.getAllByLabelText('delete list item')[0]
    userEvent.click(delBtn);

    //assert
    const errAlert = await screen.findByText(/system error/i);
    expect(errAlert).toBeInTheDocument();
  })

})