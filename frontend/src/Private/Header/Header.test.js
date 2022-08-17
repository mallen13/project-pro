import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Header from './Header';

describe('header', ()=> {
    it('opens on click', ()=> {
        //arrange
        render(<Header 
            user={{name: 'test name', email: 'fake@email.com'}} 
            setLists={null} 
            setUser={null} 
        />)

        //act
        const menuBtn = screen.getByLabelText('menu button');
        userEvent.click(menuBtn);

        //assert
        const signOutBtn = screen.getByText(/sign out/i);
        expect(signOutBtn).toBeVisible();
    })

    it('closes on click after opening', ()=> {
        //arrange
        render(<Header 
            user={{name: 'test name', email: 'fake@email.com'}} 
            setLists={null} 
            setUser={null} 
        />)

        //act
        const menuBtn = screen.getByLabelText('menu button');
        userEvent.click(menuBtn);

        //assert
        userEvent.click(menuBtn);
        const signOutBtn = screen.getByText(/sign out/i);
        expect(signOutBtn).not.toBeVisible();

       
    })

    it.skip('closes on click after opening', ()=> {
        //arrange
        render(<Header 
        user={{name: 'test name', email: 'fake@email.com'}} 
        setLists={jest.fn()} 
        setUser={jest.fn()} 
        />)

        //act
        const menuBtn = screen.getByLabelText('menu button');
        userEvent.click(menuBtn);

        //assert
        const signOutBtn = screen.getByText(/sign out/i);
        expect(signOutBtn).toBeVisible();

        userEvent.click(signOutBtn);
    })
})