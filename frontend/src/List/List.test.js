import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockFetch } from '../functions/testHelpers';
import List from './List';

describe('list', ()=> {

  const list = {
    id: 1,
    title: 'to-do list',
    items: [
      'go to store',
      'watch tv'
    ]
  }

  //get fetch before mock
  const unmockedFetch = global.fetch;

  //reset fetch after each
  afterAll(()=> global.fetch = unmockedFetch);

  it('deletes list', async ()=> {
    //arrange
    mockFetch('success');
    
    render(<List list={list} setLists={jest.fn()} setToast={jest.fn()} />);

    //act
    const delBtn = screen.getByLabelText('delete list');
    userEvent.click(delBtn);

    //assert
    expect(delBtn).toBeDisabled();
    await waitFor( ()=> expect(delBtn).not.toBeDisabled() );

  });

  it('fetch error deleting list', async ()=> {
    //arrange
    mockFetch('error');
    
    render(<List list={list} setLists={jest.fn()} setToast={jest.fn()} />);

    //act
    const delBtn = screen.getByLabelText('delete list');
    userEvent.click(delBtn);

    //assert
    await waitFor( () => {
      const errAlert = screen.getByText(/system error./i);
      expect(errAlert).toBeInTheDocument();
    })
  })

  it('adds list item', async ()=> {
     //arrange
     mockFetch('success');
     render(<List list={list} setLists={jest.fn()} setToast={jest.fn()}/>);
 
     //act
     const input = screen.getByLabelText('new list item input');
     const addBtn = screen.getByText('Add');
     userEvent.type(input,'item1');
     userEvent.click(addBtn);
 
     //assert
     expect(addBtn).toBeDisabled();
     await waitFor( ()=> expect(addBtn).not.toBeDisabled() );
  
  });

  it('message if adding blank item', async ()=> {
    //arrange
    mockFetch('success');
    render(<List list={list} setLists={jest.fn()} setToast={jest.fn()}/>);

    //act
    const addBtn = screen.getByText('Add');
    userEvent.click(addBtn);

    //assert
    await waitFor( ()=> {
      const errMsg = screen.getByText(/cannot be blank/i);
      expect(errMsg).toBeInTheDocument();
    });
 
 });

 it('message if adding item that already exists', async ()=> {
  //arrange
  mockFetch('success');
  render(<List list={list} setLists={jest.fn()} setToast={jest.fn()}/>);

  //act
  const input = screen.getByLabelText('new list item input');
  const addBtn = screen.getByText('Add');
  userEvent.type(input,'go to store');
  userEvent.click(addBtn);

  //assert
  await waitFor( ()=> {
    const errMsg = screen.getByText(/already exists/i);
    expect(errMsg).toBeInTheDocument();
  });

});

  it('fetch error adding list item', async ()=> {
    //arrange
    mockFetch('error');
    render(<List list={list} setLists={jest.fn()} setToast={jest.fn()}/>);

    //act
    const input = screen.getByLabelText('new list item input');
    const addBtn = screen.getByText('Add');
    userEvent.type(input,'item1');
    userEvent.click(addBtn);

    //assert
    await waitFor( () => {
      const errAlert = screen.getByText(/system error./i);
      expect(errAlert).toBeInTheDocument();
    })
  })

  it('deletes list item', async ()=> {
    //arrange
    mockFetch('success');
    render(<List list={list} setLists={jest.fn()} setToast={jest.fn()}/>);

    //act
    const delBtn = screen.getAllByLabelText('delete list item')[0];
    userEvent.click(delBtn);

    //assert
    expect(delBtn).toBeDisabled();
    await waitFor( ()=> expect(delBtn).not.toBeDisabled());
  });

  it('fetch error deleting list item', async ()=> {
    //arrange
    mockFetch('error');
    render(<List list={list} setLists={jest.fn()} setToast={jest.fn()}/>);

    //act
    const delBtn = screen.getAllByLabelText('delete list item')[0]
    userEvent.click(delBtn);

    //assert
    await waitFor( () => {
      const errAlert = screen.getByText(/system error./i);
      expect(errAlert).toBeInTheDocument();
    })
  })

})