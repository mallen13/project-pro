import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
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

  it.skip('sets lists after fetch', async ()=> {
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
    const list = await screen.findByText('to-do list');
    expect(list).toBeInTheDocument();
  });

  it.skip('sets no lists after fetch if no lists', async ()=> {
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
    const list = await screen.findByText('to-do list');
    expect(list).toBeInTheDocument();
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

})





