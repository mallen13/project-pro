import styles from './Alert.module.css';
import { ExclamationTriangle } from 'react-bootstrap-icons';

const Alert = ({display,setDisplay,message,focusRef = null}) => {

  const handleClick = () => {
    setDisplay({display: 'none', message: ''}); 
    if (focusRef) focusRef.current.focus();
  }

  return (
    <div className={styles.alertOverlay} style={{display: display}} onClick={handleClick}>
      <div className={styles.alert}>
        {/* Head */}
        <div className={styles.alertHead}>
            <div className={styles.container}>
              <ExclamationTriangle size='25' color='gold' />
              <h3>Alert</h3> 
            </div>
        </div>

        {/* Body */}
        <p style={{marginBottom: '10px'}}>{message}</p>
        
        {/* Footer/ Close Button */}
        <div className={styles.alertFooter}>
          <button onClick={handleClick}>Okay</button>
        </div>
      </div>
    </div>
    
  )
}

export default Alert;