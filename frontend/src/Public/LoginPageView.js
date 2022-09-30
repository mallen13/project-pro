import { DoorOpenFill, PencilFill } from 'react-bootstrap-icons';
import styles from './LoginPage.module.css';
import logo from '../logo.png';

const LoginPageView = ({
    demo,
    demoLoggingIn,
    login,
    setLoginCreds,
    loginEmailRef,
    loginPasswordRef,
    isLoggingIn,
    register,
    isRegistering,
    registerEmailRef,
    registerPasswordRef,
    registerNameRef,
    setRegisterInfo}) => (
    <>
        <div className={styles.branding}>
            <img src={logo} alt='Project Pro' />
        </div>
        <h1>Project Pro</h1>
        <p>Create Projects. Add Tasks. Get Organized.</p>

        <div className={styles.container}>
            {/* login input */}
            <form className={styles.formContainer} onSubmit={e => e.preventDefault()}>

                <div className={styles.logoContainer}>
                    <DoorOpenFill size='45' color='#32a2ad' />
                </div>
                <h2>Log in to your account</h2>
                <p>Time to get busy!</p>
            
                {/* Email */}
                <label htmlFor='loginEmail'>Email</label>
                <input  
                    onChange={ (e)=> 
                        setLoginCreds( prevState => ({
                        ...prevState,
                        email: e.target.value
                        }))
                    }
                    ref={loginEmailRef}
                    name='loginEmail'
                    placeholder='Email Address'
                    autoComplete='email'
                />

                {/* Password */}
                <label htmlFor='loginPW'>Password</label>
                <input 
                    type='password'
                    onChange={ (e)=> setLoginCreds( prevState => ({
                        ...prevState,
                        password: e.target.value
                    }))}
                    ref={loginPasswordRef}
                    name='lognPW'
                    autoComplete='current-password'
                    placeholder='Password'
                />

                {/* Login */}
                <button onClick={login} disabled={isLoggingIn} type='submit'>
                    {isLoggingIn ? 'Logging In' : 'Login'}
                </button>

                {/* Demo User */}
                <button 
                    className={styles.demoBtn}
                    onClick={demo} 
                    disabled={demoLoggingIn}
                >
                    {demoLoggingIn ? 'Logging In' : 'Demo User (Try me!)'}
                </button>
            </form>
            
            <h2 className={styles.formDivider}>or...</h2>

            {/* register input */}
            <form className={styles.formContainer} onSubmit={ e => e.preventDefault()}>
                <div className={styles.logoContainer}>
                    <PencilFill size='45' color='#32a2ad' />
                </div>
                
                <h2>Create an account</h2>
                <p>What are you waiting for?</p>
              
                {/* Name */}
                <label htmlFor='registerName'>Full Name</label>
                <input 
                    onChange={ (e)=> setRegisterInfo( prevState => ({
                        ...prevState,
                        name: e.target.value
                    }))}
                    ref={registerNameRef}
                    name='registerName'
                    placeholder='Full Name'
                    autoComplete='name'
                />

                {/* Email */}
                <label htmlFor='registerEmail'>Email</label>
                <input 
                    onChange={ (e)=> setRegisterInfo( prevState => ({
                        ...prevState,
                        email: e.target.value
                    }))}
                    ref={registerEmailRef}
                    name='registerEmail'
                    autoComplete='email'
                    placeholder='Email Address'
                />

                <label htmlFor='registerPW'>Password</label>
                <input 
                    type='password'
                    onChange={ (e)=> setRegisterInfo( prevState => ({
                        ...prevState,
                        password: e.target.value
                    }))}
                    ref={registerPasswordRef}
                    autoComplete='new-password'
                    name='registerPW'
                    placeholder='Password'
                />
                <div className={styles.pwReqContainer}>
                    5 characters: uppercase, lowercase, special character, number
                </div>
               

                <button onClick={register} disabled={isRegistering}> 
                    {isRegistering ? 'Registering' : 'Register'}
                </button>
       
            </form>
            
        </div>
    </>
)

export default LoginPageView