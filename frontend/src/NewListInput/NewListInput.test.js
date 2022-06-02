import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewListInput from './NewListInput';

it('does not submit without input', ()=> {
    //arrange
    render(<NewListInput />);

    //act
    const submitBtn = screen.getByText('Create List');
    userEvent.click(submitBtn)

    //assert
    expect(submitBtn).not.toBeDisabled();
});

it('submits with valid input', async () => {

    //render
    jest.useFakeTimers();
    render(<NewListInput />);

    //input/submit
    const submitBtn = screen.getByText('Create List');
    const input = screen.getByLabelText('New List');
    userEvent.type(input,'list title');
    userEvent.click(submitBtn);

    //mock fetch
    const successMsg = await screen.findAllByText('List Added');
    screen.debug(successMsg);

    //clear timers
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
});
