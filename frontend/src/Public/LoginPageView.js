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
        <h1>List App</h1>
        <div className={styles.container}>
            {/* login input */}
            <div className={styles.formContainer}>
                Sign In
                <input 
                    placeholder='Email Address' 
                    onChange={ (e)=> setLoginCreds( prevState => ({
                        ...prevState,
                        email: e.target.value
                    }))}
                    ref={loginEmailRef}
                />

                <input 
                    placeholder='Password' 
                    type='password'
                    onChange={ (e)=> setLoginCreds( prevState => ({
                        ...prevState,
                        password: e.target.value
                    }))}
                    ref={loginPasswordRef}
                />

                <button onClick={login} disabled={isLoggingIn}>
                    {isLoggingIn ? 'Logging In' : 'Login'}
                </button>

                <button 
                    onClick={demo} 
                    disabled={demoLoggingIn}
                >
                    {demoLoggingIn ? 'Logging In' : 'Demo User (Try me!)'}
                </button>
            </div>
            
            <p className={styles.formDivider}>or</p>

            {/* register input */}
            <div className={styles.formContainer}>
                Register
                <input 
                    placeholder='Full Name' 
                    onChange={ (e)=> setRegisterInfo( prevState => ({
                        ...prevState,
                        name: e.target.value
                    }))}
                    ref={registerNameRef}
                />

                <input 
                    placeholder='Email Address' 
                    onChange={ (e)=> setRegisterInfo( prevState => ({
                        ...prevState,
                        email: e.target.value
                    }))}
                    ref={registerEmailRef}
                />

                <input 
                    type='password'
                    placeholder='Password' 
                    onChange={ (e)=> setRegisterInfo( prevState => ({
                        ...prevState,
                        password: e.target.value
                    }))}
                    ref={registerPasswordRef}
                />
                5 characters, uppercase, lowercase, special character, number

                <button onClick={register} disabled={isRegistering}> 
                    {isRegistering ? 'Registering' : 'Register'}
                </button>
            </div>
            
        </div>
    </>
)

export default LoginPageView