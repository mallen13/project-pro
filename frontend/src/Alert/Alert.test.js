import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Alert from './Alert';

describe('alert', ()=> {

    it('renders alert', async () => {
        render(<Alert display='flex' message=''/>);
        expect(screen.getByText('Alert')).toBeInTheDocument();
    });

})