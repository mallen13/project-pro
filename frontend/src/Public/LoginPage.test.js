import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginPage from './LoginPage';
import { mockFetch } from '../functions/testHelpers';
import { act } from 'react-dom/test-utils';

describe('login page', ()=> {

    //get fetch before mock
    const unmockedFetch = global.fetch;

    //reset fetch after each
    afterAll(()=> global.fetch = unmockedFetch);

    it('shows an error if no username', async ()=> {
        //arrange
        render(<LoginPage setUser={null} />);

        //act
        const pwInput = screen.getAllByPlaceholderText('Password')[0];
        userEvent.type(pwInput, 'password');
        
        const loginBtn = screen.getByText('Login');
        userEvent.click(loginBtn);

        //assert
        const invalidMsg = await screen.findByText('Email Address is required');
        expect(invalidMsg).toBeInTheDocument();
    });

    it('shows an error if no password', async ()=> {
        //arrange
        render(<LoginPage setUser={null} />);

        //act
        const emailInput = screen.getAllByPlaceholderText('Email Address')[0];
        userEvent.type(emailInput, 'email');
        
        const loginBtn = screen.getByText('Login');
        userEvent.click(loginBtn);

        //assert
        const invalidMsg = await screen.findByText('Password is required');
        expect(invalidMsg).toBeInTheDocument();
    });

    it('shows an error if invalid username/password', async ()=> {
        //arrange
        mockFetch({status: 'invalid username or password'})

        render(<LoginPage setUser={null} />);

        //act
        const emailInput = screen.getAllByPlaceholderText('Email Address')[0];
        userEvent.type(emailInput, 'email');

        const pwInput = screen.getAllByPlaceholderText('Password')[0];
        userEvent.type(pwInput, 'password');
        
        const loginBtn = screen.getByText('Login');
        userEvent.click(loginBtn);

        //assert
        const invalidMsg = await screen.findByText(/invalid username or password/i);
        expect(invalidMsg).toBeInTheDocument();
    });

    it('shows a system err if bad fetch', async ()=> {
        //arrange
        mockFetch({status: 'server error'})

        render(<LoginPage setUser={null} />);

        //act
        const emailInput = screen.getAllByPlaceholderText('Email Address')[0];
        userEvent.type(emailInput, 'email');

        const pwInput = screen.getAllByPlaceholderText('Password')[0];
        userEvent.type(pwInput, 'password');
        
        const loginBtn = screen.getByText('Login');
        userEvent.click(loginBtn);

        //assert
        const invalidMsg = await screen.findByText(/system error/i);
        expect(invalidMsg).toBeInTheDocument();
    });

    it('shows a system err if bad fetch w/ demo user', async ()=> {
        //arrange
        mockFetch({status: 'server error'})

        render(<LoginPage setUser={null} />);

        //act
        const loginBtn = screen.getByText(/Demo User/);
        userEvent.click(loginBtn);

        //assert
        const invalidMsg = await screen.findByText(/system error/i);
        expect(invalidMsg).toBeInTheDocument();
    });

    it('shows loading on slow login', async ()=> {
        //arrange
        jest.useFakeTimers();

        global.fetch = () => new Promise( resolve => {
            setTimeout( ()=> {
                resolve( {json: ()=> Promise.resolve({status:'error'})});
            },3000)
          })

        render(<LoginPage setUser={jest.fn()} />);
     
         //act
         const emailInput = screen.getAllByPlaceholderText('Email Address')[0];
         userEvent.type(emailInput, 'email');
 
         const pwInput = screen.getAllByPlaceholderText('Password')[0];
         userEvent.type(pwInput, 'password');
         
         const loginBtn = screen.getByText('Login');
         userEvent.click(loginBtn);
 
        //assert
        act( ()=> jest.advanceTimersByTime(1100) );
        const loadingText = await screen.findByText(/Logging In/);
        expect(loadingText).toBeInTheDocument();

        jest.runAllTimers();

        await waitFor( ()=> {
            expect(loginBtn).not.toBeDisabled();
        })
        
        jest.useRealTimers();
    });

    it('shows loading on slow login w/ demo user', async ()=> {
          //arrange
          jest.useFakeTimers();

          global.fetch = () => new Promise( resolve => {
              setTimeout( ()=> {
                  resolve( {json: ()=> Promise.resolve({status:'error'})});
              },3000)
            })
  
          render(<LoginPage setUser={jest.fn()} />);
       
           //act
           const emailInput = screen.getAllByPlaceholderText('Email Address')[0];
           userEvent.type(emailInput, 'email');
   
           const pwInput = screen.getAllByPlaceholderText('Password')[0];
           userEvent.type(pwInput, 'password');
           
           const loginBtn = screen.getByText('Login');
           userEvent.click(loginBtn);
   
          //assert
          act( ()=> jest.advanceTimersByTime(1100) );
          const loadingText = await screen.findByText(/Demo User/);
          expect(loadingText).toBeInTheDocument();
  
          jest.runAllTimers();
  
          await waitFor( ()=> {
              expect(loginBtn).not.toBeDisabled();
          })
          
          jest.useRealTimers();
    });

})

describe('registers user', ()=> {

    //get fetch before mock
    const unmockedFetch = global.fetch;

    //reset fetch after each
    afterAll(()=> global.fetch = unmockedFetch);

    it('shows an error if no name', async ()=> {
        //arrange
        render(<LoginPage setUser={null} />);

        //act
        const registerBtn = screen.getByText('Register');
        userEvent.click(registerBtn);

        //assert
        const errMsg = await screen.findByText(/name required to register/i);
        expect(errMsg).toBeInTheDocument();
    });

    it('shows an error if no email', async ()=> {
        //arrange
        render(<LoginPage setUser={null} />);

        //act
        const nameInput = screen.getByPlaceholderText('Full Name');
        userEvent.type(nameInput, 'name');
        
        const registerBtn = screen.getByText('Register');
        userEvent.click(registerBtn);

        //assert
        const errMsg = await screen.findByText(/email required to register/i);
        expect(errMsg).toBeInTheDocument();
    });

    it('shows an error if bad email', async ()=> {
        //arrange
        render(<LoginPage setUser={null} />);

        //act
        const nameInput = screen.getByPlaceholderText('Full Name');
        userEvent.type(nameInput, 'name');

        const emailInput = screen.getAllByPlaceholderText('Email Address')[1];
        userEvent.type(emailInput, 'email');
        
        const registerBtn = screen.getByText('Register');
        userEvent.click(registerBtn);

        //assert
        const errMsg = await screen.findByText(/invalid email address format/i);
        expect(errMsg).toBeInTheDocument();
    });

    it('shows an error if no password', async ()=> {
        //arrange
        render(<LoginPage setUser={null} />);

        //act
        const nameInput = screen.getByPlaceholderText('Full Name');
        userEvent.type(nameInput, 'name');

        const emailInput = screen.getAllByPlaceholderText('Email Address')[1];
        userEvent.type(emailInput, 'email@email.com');
        
        const registerBtn = screen.getByText('Register');
        userEvent.click(registerBtn);

        //assert
        const errMsg = await screen.findByText(/password required to register/i);
        expect(errMsg).toBeInTheDocument();
    });

    it('shows an error if bad password', async ()=> {
         //arrange
         render(<LoginPage setUser={null} />);

         //act
         const nameInput = screen.getByPlaceholderText('Full Name');
         userEvent.type(nameInput, 'name');
 
         const emailInput = screen.getAllByPlaceholderText('Email Address')[1];
         userEvent.type(emailInput, 'email@email.com');

         const passwordInput = screen.getAllByPlaceholderText('Password')[1];
         userEvent.type(passwordInput, 'password');
         
         const registerBtn = screen.getByText('Register');
         userEvent.click(registerBtn);
 
         //assert
         const errMsg = await screen.findByText(/invalid password format/i);
         expect(errMsg).toBeInTheDocument();
    });

    it('shows a system err if server error', async ()=> {
        //arrange
        mockFetch({status: 'server error'});

        //arrange
        render(<LoginPage setUser={null} />);

        //act
        const nameInput = screen.getByPlaceholderText('Full Name');
        userEvent.type(nameInput, 'name');

        const emailInput = screen.getAllByPlaceholderText('Email Address')[1];
        userEvent.type(emailInput, 'email@email.com');

        const passwordInput = screen.getAllByPlaceholderText('Password')[1];
        userEvent.type(passwordInput, 'Pasword13!');
        
        const registerBtn = screen.getByText('Register');
        userEvent.click(registerBtn);

        //assert
        const errMsg = await screen.findByText(/system error/i);
        expect(errMsg).toBeInTheDocument();
    });

    it('shows a system err if duplicate registration', async ()=> {
        //arrange
        mockFetch({status: 'Duplicate'});

        //arrange
        render(<LoginPage setUser={null} />);

        //act
        const nameInput = screen.getByPlaceholderText('Full Name');
        userEvent.type(nameInput, 'name');

        const emailInput = screen.getAllByPlaceholderText('Email Address')[1];
        userEvent.type(emailInput, 'email@email.com');

        const passwordInput = screen.getAllByPlaceholderText('Password')[1];
        userEvent.type(passwordInput, 'Pasword13!');
        
        const registerBtn = screen.getByText('Register');
        userEvent.click(registerBtn);

        //assert
        const errMsg = await screen.findByText(/account already exists/i);
        expect(errMsg).toBeInTheDocument();
    });

    it('registers successfully ', async ()=> {
         //arrange
        mockFetch('success');
        render(<LoginPage setUser={null} />);

        //act
        const nameInput = screen.getByPlaceholderText('Full Name');
        userEvent.type(nameInput, 'name');

        const emailInput = screen.getAllByPlaceholderText('Email Address')[1];
        userEvent.type(emailInput, 'email@email.com');

        const passwordInput = screen.getAllByPlaceholderText('Password')[1];
        userEvent.type(passwordInput, 'Pasword13!');
        
        const registerBtn = screen.getByText('Register');
        userEvent.click(registerBtn);

        //assert
        const successMsg = await screen.findByText(/account created/i);
        expect(successMsg).toBeInTheDocument();
        
    });

    it('shows registering on slow login', async ()=> {
        //arrange
        jest.useFakeTimers();

        global.fetch = () => new Promise( resolve => {
            setTimeout( ()=> {
                resolve( {json: ()=> Promise.resolve({status:'error'})});
            },3000)
          })

        render(<LoginPage setUser={jest.fn()} />);
     
         //act
         const nameInput = screen.getByPlaceholderText('Full Name');
         userEvent.type(nameInput, 'name');

         const emailInput = screen.getAllByPlaceholderText('Email Address')[1];
         userEvent.type(emailInput, 'email@email.com');
 
         const pwInput = screen.getAllByPlaceholderText('Password')[1];
         userEvent.type(pwInput, 'Password45!');
         
         const registerBtn = screen.getByText('Register');
         userEvent.click(registerBtn);
 
        //assert
        act( ()=> jest.advanceTimersByTime(1100) );
        const loadingText = await screen.findByText(/registering/i);
        expect(loadingText).toBeInTheDocument();

        jest.runAllTimers();

        await waitFor( ()=> {
            expect(registerBtn).not.toBeDisabled();
        })
        
        jest.useRealTimers();
    });
})