import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import { mockFetch,setLocalStorage } from '../../functions/testHelpers';
import userEvent from '@testing-library/user-event';
import NewListInput from './NewListInput';

describe('new list input', ()=> {
    //get fetch before mock
    const unmockedFetch = global.fetch;

    //reset fetch after each
    afterAll(()=> global.fetch = unmockedFetch);

    it('gets a new access token on unauth login', async () => {
        //set local storage -> set a user/refresh token
        setLocalStorage();
  
        //mock fetch to invalid token
        mockFetch(null,403);

        //arrange
        render(<NewListInput lists={null} setLists={jest.fn()} setUser={jest.fn()}/>);
        
        //act
        const input = screen.getByPlaceholderText('Project Title');
        const submitBtn = screen.getByText(/new/i);
        userEvent.type(input,'to-do list');
        userEvent.click(submitBtn);

        //fetch returns token
        mockFetch({
            token: '6789',
            user: {
                email: 'email',
                name: 'name'
            }
        })

        //assert
        const responseMsg = await screen.findByText(/system error/i);
        expect(responseMsg).toBeInTheDocument();

        //clear local storage
        window.localStorage.clear();
    })

    it('does not submit without input', () => {
        //arrange
        render(<NewListInput />);

        //act
        const submitBtn = screen.getByText(/new/i);
        userEvent.click(submitBtn)

        //assert
        expect(submitBtn).not.toBeDisabled();
    });

    it('does not allow duplicate lists to be added', async () => {
        //arrange
            const lists = [
                {
                title: 'to-do list', 
                items: ['item1','item2']
                }
            ]

        render(<NewListInput lists={lists} setLists={jest.fn()}/>);
        
        //act
        const input = screen.getByPlaceholderText('Project Title');
        const submitBtn = screen.getByText(/new/i);
        userEvent.type(input,'to-do list');
        userEvent.click(submitBtn);

        //expect
        const errMsg = await screen.findByText(/already exists/i);
        expect(errMsg).toBeInTheDocument();
    });

    it('shows an error when bad api response', async () => {
        //arrange
    render(<NewListInput lists={[]} setLists={jest.fn()}/>);
    mockFetch('error');

        //act
        const input = screen.getByPlaceholderText('Project Title');
        const submitBtn = screen.getByText(/new/i);
        userEvent.type(input,'to-do list');
        userEvent.click(submitBtn);

        //expect
        const errMsg = await screen.findByText(/system error/i);
        expect(errMsg).toBeInTheDocument();
    });

    it('successfully submits with valid input', async () => {
        //arrange
        render(<NewListInput lists={null} setLists={jest.fn()}/>);
        mockFetch({listId: 1});

        //act
        const input = screen.getByPlaceholderText('Project Title');
        const submitBtn = screen.getByText(/new/i);
        userEvent.type(input,'to-do list');
        userEvent.click(submitBtn);

        //assert
        const successMsg = await screen.findByText(/added/i);
        expect(successMsg).toBeInTheDocument();
    });

    it('shows message on slow fetch', async () => {
        //arrange
        jest.useFakeTimers();
        render(<NewListInput lists={null} setLists={jest.fn()}/>);
        global.fetch = () => new Promise( resolve => {
            setTimeout( ()=> {
                resolve( {json: ()=> Promise.resolve({listId: 1})});
            },3000)
          })

        //act
        const input = screen.getByPlaceholderText('Project Title');
        const submitBtn = screen.getByText(/new/i);
        userEvent.type(input,'to-do list');
        userEvent.click(submitBtn);

        act( ()=> jest.advanceTimersByTime(1000) );

        //assert
        const successMsg = await screen.findByText(/creating/i);
        expect(successMsg).toBeInTheDocument();

        // const newProj = await screen.findByText(/new project/i);
        // expect(newProj).toBeInTheDocument();

        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('successfully submits with valid input, no current lists', async () => {

        //arrange
        render(<NewListInput lists={[{title: 'test', items: []}]} setLists={jest.fn()}/>);
        mockFetch({listId: 1});

        //act
        const input = screen.getByPlaceholderText('Project Title');
        const submitBtn = screen.getByText(/new/i);
        userEvent.type(input,'to-do list');
        userEvent.click(submitBtn);

        //assert
        const successMsg = await screen.findByText(/added/i);
        expect(successMsg).toBeInTheDocument();
    });
})
