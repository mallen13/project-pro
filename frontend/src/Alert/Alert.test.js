import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Alert from './Alert';

describe('alert', ()=> {

    it('renders alert', async () => {
        render(<Alert display='flex' message=''/>);
        expect(screen.getByText('Alert')).toBeInTheDocument();
    });

    it('closes alert after hitting x button', () => {

        const closeAlert = jest.fn();

        render(<Alert display={'block'} message='' setDisplay={closeAlert} focusRef={{current: {focus: (jest.fn())}}}/>);

        const exitBtn = screen.getByText('Okay');
        userEvent.click(exitBtn);

        expect(closeAlert).toHaveBeenCalled();
    })

})