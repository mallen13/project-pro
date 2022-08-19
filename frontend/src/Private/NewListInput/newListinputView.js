import styles from './NewListInput.module.css';

const NewListInputView = ({
    addList,
    inputRef,
    isLoading,
    setInput,
}) => (
    <div className={styles.newListInputContainer}>
        <div className={styles.subContainer}>
            <input 
                ref={inputRef}
                id='listInput'
                aria-label='new list input'
                placeholder='Project Title' 
                onChange={e => setInput(e.target.value)}/>
            <button 
                onClick={addList}
                disabled={isLoading ? true : false}
            >
                {!isLoading ? 'New' : 'Creating' }
            </button>
        </div>
    </div>
)

export default NewListInputView