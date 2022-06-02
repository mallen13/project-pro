import styles from './NewListInput.module.css';

const NewListInputView = ({
    addList,
    inputRef,
    isLoading,
    setInput,
}) => (
    <div className={styles.newListInputContainer}>
        <label htmlFor='listInput'>New List</label>
        <div>
            <input 
                ref={inputRef}
                id='listInput'
                placeholder='List Title' 
                onChange={e => setInput(e.target.value)}/>
            <button 
                onClick={addList}
                disabled={isLoading ? true : false}
            >
                {!isLoading ? 'Create List' : 'Creating...' }
            </button>
        </div>
    </div>
)

export default NewListInputView