import { useRef,useState } from 'react';
import styles from './LoginPage.module.css';
import LoginPageView from './LoginPageView';
import Alert from '../Alert/Alert';
import Toast from '../Toast/Toast';
import { isValidEmail, isValidPassword, postData } from '../functions/functions';

const LoginPage = ({setUser}) => {

  const loginEmailRef= useRef();
  const loginPasswordRef= useRef();
  const registerEmailRef= useRef();
  const registerPasswordRef= useRef();
  const registerNameRef = useRef();

  //state
  const [alert,setAlert] = useState({display: 'none', message:''})
  const [inputRefState,setInputRefState] = useState();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [demoLoggingIn, setDemoLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginCreds,setLoginCreds] = useState({email: '', password: ''});
  const [registerInfo,setRegisterInfo] = useState({email: '', name: '', password: ''});
  const [toast,setToast] = useState({display: 'none', message: ''});


  //check for token, set is auth if valid

    //demo
    const demo = async () => {
      const timer = setTimeout( ()=> setDemoLoggingIn(true),1000);

      //const url = 'http://localhost:8080/list-app/login';
      const url = 'https://mattallen.tech/list-app/login';
      const data = await postData({email: 'demo@demo.com', password: 'Test12345!'},url);
      clearTimeout(timer);

      //success
      if (data.accessToken) {
        setDemoLoggingIn(false);
        setUser({
          token: data.accessToken,
          email: data.user.email,
          name: data.user.name
        });
        return;
     }

      //err
      setAlert({display: 'flex', message: 'System Error. Please Try again later.'})
      setInputRefState(loginEmailRef);

    }

    //login
    const login = async () => {

      //validate
      if (loginCreds.email === '') {
        setInputRefState(loginEmailRef);
        return setAlert({display: 'flex', message: 'Email Address is required'});
      }
      
      if (loginCreds.password === '') {
        setInputRefState(loginPasswordRef);
        return setAlert({display: 'flex', message: 'Password is required'});
      }  
      
     //post
     const timer = setTimeout( ()=> setIsLoggingIn(true),1000);
     const url = 'http://localhost:8080/list-app/login';
     //const url = 'https://mattallen.tech/list-app/login';

     const data = await postData(loginCreds,url);
     clearTimeout(timer);
     setIsLoggingIn(false);

     //successful login
     if (data.accessToken) {
        loginEmailRef.current.value = '';
        loginPasswordRef.current.value = '';
        setLoginCreds({email: '', password: ''});

        //store jwt

        setToast({display: 'none', message: ''});
        setUser({
          token: data.accessToken,
          email: data.user.email,
          name: data.user.name
        });
        return;
     }

     //invalid
     if (data.status === 'invalid username or password') {
      setAlert({display: 'flex', message: 'Invalid Username or Password'})
      setInputRefState(loginEmailRef);
      return
     } 
      
    //else
    setAlert({display: 'flex', message: 'System Error. Please Try again later.'})
    setInputRefState(loginEmailRef);
     
    }

    //register
    const register = async () => {
      //validate
      if (registerInfo.name === '') {
        setInputRefState(registerNameRef);
        return setAlert({display: 'flex', message: 'Name required to register.'});
      }

      if (registerInfo.email === '') {
        setInputRefState(registerEmailRef);
        return setAlert({display: 'flex', message: 'Email required to register.'});
      }

      if (!isValidEmail(registerInfo.email)) {
        setInputRefState(registerEmailRef);
        return setAlert({display: 'flex', message: 'Invalid email address format.'});
      }

      if (registerInfo.password === '') {
        setInputRefState(registerPasswordRef);
        return setAlert({display: 'flex', message: 'Password required to register'});
      }

      if (!isValidPassword(registerInfo.password)) {
        setInputRefState(registerPasswordRef);
        return setAlert({display: 'flex', message: 'Invalid password format.'});
      }
      
     //post
     const timer = setTimeout( ()=>setIsRegistering(true),1000);
     //const url = 'http://localhost:8080/list-app/register';
     const url = 'https://mattallen.tech/list-app/register';
     const registerStatus = await postData({user: registerInfo},url);

    clearTimeout(timer);
    setIsRegistering(false);

     //post success
     if (registerStatus === 'success') {
      registerNameRef.current.value = '';
      registerEmailRef.current.value = '';
      registerPasswordRef.current.value = '';
      setRegisterInfo({name: '', email: '', password: ''});
      setToast({display: 'flex', message: 'Account Created'});
      return 
     }

     //post err
     if (registerStatus.status && registerStatus.status.includes('Duplicate')) {
        setInputRefState(registerEmailRef);
        setAlert({display: 'flex',message:'Account already exists.'});
     } else {
      setAlert({display: 'flex', message:'System Error. Please try again later.'})
     }
    }

  return (
    <div className={styles.pageContainer}>
        <Alert 
          display={alert.display} 
          setDisplay={setAlert} 
          message={alert.message} 
          focusRef={inputRefState} 
        />

        <Toast
          display={toast.display}
          setDisplay={setToast}
          message={toast.message} 
        />

        <LoginPageView 
          demo={demo}
          demoLoggingIn={demoLoggingIn}
          login={login} 
          setLoginCreds={setLoginCreds}
          loginEmailRef={loginEmailRef} 
          loginPasswordRef={loginPasswordRef} 
          isLoggingIn={isLoggingIn}

          register={register}
          isRegistering={isRegistering}
          setRegisterInfo={setRegisterInfo} 
          registerEmailRef={registerEmailRef} 
          registerPasswordRef={registerPasswordRef} 
          registerNameRef={registerNameRef} 
        />
    </div>
  )
}

export default LoginPage;