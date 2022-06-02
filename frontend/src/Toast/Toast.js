import styles from './Toast.module.css'

const Toast = ({display,setDisplay,message,duration = 5000}) => (
    <>
    <div className={styles.toastOverlay}>
      <div className={styles.toast} style={{display: display}}>
          <div className={styles.toastHead}>
              Success
              <button aria-label='exit button' onClick={() => setDisplay({display: 'none', message: ''})}>x</button>
          </div>
          {message}
      </div>
    </div>
    </>
)

export default Toast;