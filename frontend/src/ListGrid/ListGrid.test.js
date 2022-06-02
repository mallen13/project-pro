import { render,screen } from '@testing-library/react';
import { mockFetch } from '../functions/testHelpers';
import ListGrid from './ListGrid';

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
})


