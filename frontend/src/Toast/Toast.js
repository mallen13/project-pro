import styles from './Toast.module.css';
import { CheckCircle, X } from 'react-bootstrap-icons';

const Toast = ({display,setDisplay,message}) => (
    <>
    <div className={styles.toastOverlay}>
      <div className={styles.toast} style={{display: display}}>
          <div className={styles.toastHead}>
              <div className={styles.headContainer}>
                <CheckCircle size='25' />
                <h3>Success</h3>
              </div>
             
              <button 
                aria-label='exit button' 
                onClick={() => setDisplay({display: 'none', message: ''})}
              >
                <X size='35' />
              </button>
          </div>
          <p>{message}</p>
      </div>
    </div>
    </>
)

export default Toast;