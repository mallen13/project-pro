import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Toast from './Toast';

describe('toast', ()=> {

    it('renders toast', async () => {
        render(<Toast display='flex' message='' setDisplay={null}/>);

        const toast = screen.getByText('Success');
        expect(toast).toBeInTheDocument();
    });

    it('closes toast after hitting x button', () => {

        const closeToast = jest.fn();

        render(<Toast display={'block'} message='' setDisplay={closeToast}/>);

        const exitBtn = screen.getAllByLabelText('exit button')[0];
        userEvent.click(exitBtn);

        expect(closeToast).toHaveBeenCalledTimes(1);
    })

}) 