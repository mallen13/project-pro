import { render, screen } from '@testing-library/react';
import { mockFetch } from '../functions/testHelpers';
import userEvent from '@testing-library/user-event';
import NewListInput from './NewListInput';

describe('new list input', ()=> {
    //get fetch before mock
    const unmockedFetch = global.fetch;

    //reset fetch after each
    afterAll(()=> global.fetch = unmockedFetch);

    it('does not submit without input', () => {
        //arrange
        render(<NewListInput />);

        //act
        const submitBtn = screen.getByText('Create List');
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
        const input = screen.getByLabelText('New List');
        const submitBtn = screen.getByText('Create List');
        userEvent.type(input,'to-do list');
        userEvent.click(submitBtn);

        //expect
        const errMsg = await screen.findByText(/list already exists/i);
        expect(errMsg).toBeInTheDocument();
    });

    it('shows an error when bad api response', async () => {
        //arrange
    render(<NewListInput lists={[]} setLists={jest.fn()}/>);
    mockFetch('error');

        //act
        const input = screen.getByLabelText('New List');
        const submitBtn = screen.getByText('Create List');
        userEvent.type(input,'to-do list');
        userEvent.click(submitBtn);

        //expect
        const errMsg = await screen.findByText(/system error/i);
        expect(errMsg).toBeInTheDocument();
    });

    it('successfully submits with valid input', async () => {
        //arrange
    render(<NewListInput lists={[]} setLists={jest.fn()}/>);
    mockFetch('success');

        //act
        const input = screen.getByLabelText('New List');
        const submitBtn = screen.getByText('Create List');
        userEvent.type(input,'to-do list');
        userEvent.click(submitBtn);

        //assert
        const successMsg = await screen.findByText(/list added/i);
        expect(successMsg).toBeInTheDocument();
    });
})
