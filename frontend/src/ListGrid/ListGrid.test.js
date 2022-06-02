import { render, screen } from '@testing-library/react';
import ListGrid from './ListGrid';

describe('list grid', ()=> {

    it('renders lists', () => {
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

        render(<ListGrid lists={listArr} />);

        const listGrid = document.querySelector('.listGrid');

        expect(listGrid).toBeInTheDocument();
    });
})


