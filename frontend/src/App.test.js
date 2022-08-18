import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockFetch } from './functions/testHelpers';
import '@testing-library/jest-dom';
import App from './App';

describe('login <App />', ()=> {
  it('successfully log in with valid credentials', async ()=> {
    //arrange
    mockFetch({
       accessToken: 'token',
       user: {
           email: 'email',
           name: 'name'
       }
    })

    render(<App />);

    //act
    const emailInput = screen.getAllByPlaceholderText('Email Address')[0];
    userEvent.type(emailInput, 'email');

    const pwInput = screen.getAllByPlaceholderText('Password')[0];
    userEvent.type(pwInput, 'password');
    
    const loginBtn = screen.getByText('Login');
    userEvent.click(loginBtn);

    //assert
    const errMsg = await screen.findByText(/system error/i)
    expect(errMsg).toBeInTheDocument();

  });  

  it('logs in if clicks demo user', async ()=> {
      //arrange
      mockFetch({
        accessToken: 'token',
        user: {
            email: 'email',
            name: 'name'
        }
      })

      render(<App />);

      //act
      const loginBtn = screen.getByText(/demo user/i);
      userEvent.click(loginBtn);

      //assert (err fetching lists)
      const errMsg = await screen.findByText(/system error/i)
      expect(errMsg).toBeInTheDocument();
  });
})

describe('signout <App />', ()=> {

  const unmockedFetch = global.fetch;

  //reset fetch after each
  afterAll(()=> global.fetch = unmockedFetch);

  it('signs out after clicking button', async ()=> {
    //arrange
     mockFetch({
      accessToken: 'token',
      user: {
          email: 'email',
          name: 'name'
      }
    })
    render(<App />);

    //login
    const loginBtn = screen.getByText(/demo user/i);
    userEvent.click(loginBtn);
    mockFetch({lists: []})

    //open menu
    await screen.findByText(/create a list/i)
    const menu = screen.getByLabelText('menu button');
    userEvent.click(menu);

    //sign out
    const logoutBtn = screen.getByText(/sign out/i);
    userEvent.click(logoutBtn);

    //assertion
    const signInHeader = screen.getByText(/log in to your account/i);
    expect(signInHeader).toBeInTheDocument();
  })
})

describe('lists', ()=> {

  const list = {
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

  it('sets lists after fetch', async ()=> {
    //mock fetch
    mockFetch({
      accessToken: 'token',
      user: {
          email: 'email',
          name: 'name'
      }
    })

    //render
    render(<App />);

    //login
    const loginBtn = screen.getByText(/demo user/i);
    userEvent.click(loginBtn);

    mockFetch({
      lists: [{
        id: 1,
        title: 'to-do list',
        items: [
          'go to store',
          'watch tv'
        ]
        }]
    })

    //expect
    const list = await screen.findByText('to-do list');
    expect(list).toBeInTheDocument();
  });

  it('sets no lists after fetch if no lists', async ()=> {
     //mock fetch
     mockFetch({
      accessToken: 'token',
      user: {
          email: 'email',
          name: 'name'
      }
    })

    //render
    render(<App />);

    //login
    const loginBtn = screen.getByText(/demo user/i);
    userEvent.click(loginBtn);

    mockFetch({
      lists: []
    })

    //expect
    const list = await screen.findByText(/create a list/i);
    expect(list).toBeInTheDocument();
  });

  it('displays alert if bad auth on list fetch', async ()=> {
    //mock fetch
    mockFetch({
     accessToken: 'token',
     user: {
         email: 'email',
         name: 'name'
     }
    })

   //render
   render(<App />);

   //login
   const loginBtn = screen.getByText(/demo user/i);
   userEvent.click(loginBtn);

   mockFetch(null,403)

   //expect
   const alert = await screen.findByText(/login expired/i);
   expect(alert).toBeInTheDocument();
 });

  it('sets an error on server error', async ()=> {
     //mock fetch
     mockFetch({
      accessToken: 'token',
      user: {
          email: 'email',
          name: 'name'
      }
    })

    //render
    render(<App />);

    //login
    const loginBtn = screen.getByText(/demo user/i);
    userEvent.click(loginBtn);

    //expect
    const errMsg = await screen.findByText(/system error/i);
    expect(errMsg).toBeInTheDocument();
  });

  it('sets an error if unable to fetch lists', async ()=> {
    //mock fetch
    mockFetch({
     accessToken: 'token',
     user: {
         email: 'email',
         name: 'name'
     }
   })

   //render
   render(<App />);

   //login
   const loginBtn = screen.getByText(/demo user/i);
   userEvent.click(loginBtn);

   //expect
   const errMsg = await screen.findByText(/system error/i);
   expect(errMsg).toBeInTheDocument();
 });

  it('shows fetching on slow list retrieval', async ()=> {
     //arrange
     mockFetch({
      accessToken: 'token',
      user: {
          email: 'email',
          name: 'name'
      }
    })
    render(<App />);



    //act
    const loginBtn = screen.getByText(/demo user/i);
    userEvent.click(loginBtn);

    const lists = [{
      id: 1,
      title: 'to-do list',
      items: [
        'go to store',
        'watch tv'
      ]
    }]

    global.fetch = () => new Promise( resolve => {
      setTimeout( ()=> {
          resolve( {json: ()=> Promise.resolve(lists)});
      },3000)
    })

    //assert
    await waitFor( ()=> {
      const removeMsg = screen.getByText(/loading lists/i);
      expect(removeMsg).toBeInTheDocument();
    }, {timeout: 3000})



  })

  it('shows an error when bad auth on list removal', async () => {
    //arrange
    mockFetch({
     accessToken: 'token',
     user: {
         email: 'email',
         name: 'name'
     }
    })
   render(<App />);

   //login
   const loginBtn = screen.getByText(/demo user/i);
   userEvent.click(loginBtn);
   mockFetch({
     lists: [{
       id: 1,
       title: 'to-do list',
       items: [
         'go to store',
         'watch tv'
       ]
       }]
   })

   //assert (err fetching lists)
   await screen.findByText(/to-do list/i);

   //delete list
   mockFetch(null,403);
   const delBtn = screen.getByLabelText('delete list');
   userEvent.click(delBtn)

   //expect
   const errMsg = await screen.findByText(/login expired/i);
   expect(errMsg).toBeInTheDocument();
  });

  it('shows an error when bad auth on list item add', async ()=> {
    //arrange
    mockFetch({
      accessToken: 'token',
      user: {
          email: 'email',
          name: 'name'
      }
     })
    render(<App />);
 
    //login
    const loginBtn = screen.getByText(/demo user/i);
    userEvent.click(loginBtn);
    mockFetch({
      lists: [{
        id: 1,
        title: 'to-do list',
        items: [
          'go to store',
          'watch tv'
        ]
        }]
    })
 
    //assert (err fetching lists)
    await screen.findByText(/to-do list/i);
 
    //add list item
    mockFetch(null,403);
    const input = screen.getAllByLabelText('new list item input')[0];
    const addBtn = screen.getAllByText('Add')[0];
    userEvent.type(input,'item1');
    userEvent.click(addBtn);
 
    //expect
    const errMsg = await screen.findByText(/login expired/i);
    expect(errMsg).toBeInTheDocument();
  })

  it('shows an error when bad auth on list item removal', async ()=> {
     //arrange
     mockFetch({
      accessToken: 'token',
      user: {
          email: 'email',
          name: 'name'
      }
     })
    render(<App />);
 
    //login
    const loginBtn = screen.getByText(/demo user/i);
    userEvent.click(loginBtn);
    mockFetch({
      lists: [{
        id: 1,
        title: 'to-do list',
        items: [
          'go to store',
          'watch tv'
        ]
        }]
    })
 
    //assert (err fetching lists)
    await screen.findByText(/to-do list/i);
 
    //delete list item
   mockFetch(null,403)
   const delBtn = screen.getAllByLabelText('delete list item')[0];
   userEvent.click(delBtn);
 
    //expect
   const errMsg = await screen.findByText(/login expired/i);
   expect(errMsg).toBeInTheDocument();
  })
})

describe('new list input <App />', ()=> {
  //get fetch before mock
  const unmockedFetch = global.fetch;

  //reset fetch after each
  afterAll(()=> global.fetch = unmockedFetch);

  it('shows an error when bad auth', async () => {
     //arrange
     mockFetch({
      accessToken: 'token',
      user: {
          email: 'email',
          name: 'name'
      }
    })

    render(<App />);

    //act
    const loginBtn = screen.getByText(/demo user/i);
    userEvent.click(loginBtn);

    mockFetch({
      lists: [{
        id: 1,
        title: 'to-do list',
        items: [
          'go to store',
          'watch tv'
        ]
        }]
    })

    //assert (err fetching lists)
    await screen.findByText(/to-do list/i);

    //create list
    const input = screen.getByPlaceholderText('List Title');
    const submitBtn = screen.getByText('Create List');
    userEvent.type(input,'new list');

    mockFetch(null,403);
    userEvent.click(submitBtn);

    //expect
    const errMsg = await screen.findByText(/login expired/i);
    expect(errMsg).toBeInTheDocument();
  });
})






