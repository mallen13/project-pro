import { render, screen } from '@testing-library/react';
import { mockFetch } from './functions/testHelpers';
import App from './App';


describe('app', ()=> {

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
      lists: [{
        title: 'to-do list', 
        items: ['item1','item2']
      }]
    })

    //render
    render(<App />);

    //expect
    const list = await screen.findByText('to-do list');
    expect(list).toBeInTheDocument();
  });

  it('sets no lists after fetch if no lists', async ()=> {
    //mock fetch
    mockFetch({lists: []})

    //render
    render(<App />);

    //expect
    const noListMsg = await screen.findByText(/no lists/i);
    expect(noListMsg).toBeInTheDocument();
  });

  it('sets an error if unable to fetch lists', async ()=> {
    //mock fetch
    mockFetch('id10t')
  
    //render
    render(<App />);

    //expect
    const errorMsg = await screen.findByText(/system error/i);
    expect(errorMsg).toBeInTheDocument();
  });

})



