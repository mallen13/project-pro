import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import List from './List';

const list = {
    title: 'to-do list',
    items: [
      'go to store',
      'watch tv'
    ]
}

describe.skip('list', ()=> {

    beforeEach( ()=> jest.useFakeTimers())
    afterEach( ()=> {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    })


    it('renders list items', () => {
        render(<List list={list} />);

        expect(document.querySelector('.listContainer')).toBeInTheDocument();

    });

    it('deletes list', async () => {
        //render
        render(<List list={list} />)

        //click delete button
        const removeBtn = screen.getByLabelText('delete list');
        removeBtn.click();

        //mock fetch



        await waitFor( ()=> {
            screen.debug();
        }, {timeout: 1000} )
    
    });

    it.todo('deletes list item');
    it.todo('adds list item');
})