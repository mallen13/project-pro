import styles from './Toast.module.css'

const Toast = ({display,setDisplay,message}) => (
    <>
    <div className={styles.toastOverlay}>
      <div className={styles.toast} style={{display: display}}>
          <div className={styles.toastHead}>
              <h3>Success</h3>
              <button aria-label='exit button' onClick={() => setDisplay({display: 'none', message: ''})}>x</button>
          </div>
          {message}
      </div>
    </div>
    </>
)

export default Toast;