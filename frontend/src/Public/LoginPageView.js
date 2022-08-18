import { DoorOpenFill, PencilFill } from 'react-bootstrap-icons';
import styles from './LoginPage.module.css';

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
        <div className={styles.placeholderBranding}></div>
        <h1>Project App</h1>
        <p>Project Management App</p>

        <div className={styles.container}>
            {/* login input */}
            <div className={styles.formContainer}>

                <div className={styles.logoContainer}>
                    <DoorOpenFill size='45' color='#32a2ad' />
                </div>
                <h2>Log in to your account</h2>
                <p>Time to get busy!</p>
            
                {/* Email */}
                <label htmlFor='loginEmail'>Email</label>
                <input  
                    onChange={ (e)=> setLoginCreds( prevState => ({
                        ...prevState,
                        email: e.target.value
                    }))}
                    ref={loginEmailRef}
                    name='loginEmail'
                    placeholder='Email Address'
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
                    placeholder='Password'
                />

                {/* Login */}
                <button onClick={login} disabled={isLoggingIn}>
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
            </div>
            
            <h2 className={styles.formDivider}>or...</h2>

            {/* register input */}
            <div className={styles.formContainer}>
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
                    name='registerPW'
                    placeholder='Password'
                />
                <div className={styles.pwReqContainer}>
                    5 characters: uppercase, lowercase, special character, number
                </div>
               

                <button onClick={register} disabled={isRegistering}> 
                    {isRegistering ? 'Registering' : 'Register'}
                </button>
       
            </div>
            
        </div>
    </>
)

export default LoginPageView