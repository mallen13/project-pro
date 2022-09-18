//create user
const createUser = async (promisePool,user) => {
    const sql = "INSERT INTO users (name,email,password) VALUES (?,?,?) ";
    await promisePool.query(sql,[user.name,user.email,user.password]);
}

//authenticate user
const findUser = async(promisePool,email) => {
    const sql = 'SELECT name,email,user_id,password FROM users WHERE email = ?' ;
    const [ user ] = await promisePool.query(sql,[email]); 
    return user;
}

//save refresh token
const saveRefreshToken = async(promisePool,token,id) => {
    const sql = 'INSERT INTO tokens(token,id) VALUES (?,?)' ;
    await promisePool.query(sql,[token,id]); 
    return null;
}

//get refresh token
const getRefreshToken = async(promisePool,token) => {
    const sql = 'SELECT token FROM tokens WHERE token = ?' ;
    const [ resp ] = await promisePool.query(sql,[token]); 
    return resp;
}

//remove refresh token
const delRefreshToken= async(promisePool,id) => {
    const sql = 'DELETE FROM tokens WHERE id = ?' ;
    const [ resp ] = await promisePool.query(sql,[id]); 
    return resp;
}


//get all lists
const getLists = async (promisePool,userId) => {
    //create lists
    const lists = [];

    //query database
    const sql = ' \
        SELECT list_names.list_id, list_names.list_name, list_items.item_name \
        FROM list_names \
        LEFT JOIN list_items \
        ON list_names.list_id = list_items.list_id \
        WHERE list_names.user_id = ?\
        ORDER BY list_names.list_id \
    ';
    const [ listsQuery ] = await promisePool.query(sql,[userId]);

    //push list to lists array
    listsQuery.forEach( listItem => {
        const hasList = lists.some( list => list.id === listItem.list_id);
        
        //if list isn't in array 
        if (!hasList) lists.push({
            id: listItem.list_id,
            title: listItem.list_name,
            items: listItem.item_name ? [listItem.item_name] : []
        })
        
        //if list is in array
        if (hasList) {
            const index = lists.findIndex( list => list.id === listItem.list_id );
            lists[index].items.push(listItem.item_name);
        }
    })

    return lists;
}

//create new list
const createList = async (promisePool,listTitle,userId) => {

    const sql = "INSERT INTO list_names (list_name,user_id) VALUES (?,?)";
    const [ resp ] = await promisePool.query(sql,[listTitle,userId]);
    return {listId: resp.insertId};
}

//delete list
const deleteList = async (promisePool,list,userId) => {

    const sql = list.items.length > 0
        ?' \
        DELETE list_items,list_names FROM list_items \
        LEFT OUTER JOIN list_names ON list_names.list_id = list_items.list_id \
        WHERE list_items.list_id = ? AND list_names.user_id = ?'
        : 'DELETE FROM list_names WHERE list_id = ? AND user_id = ?';

    await promisePool.query(sql,[list.id,userId,list.id,userId]);
}

//add list item
const addListItem = async (promisePool,listID,listItem) => {
    const sql = "INSERT INTO list_items (list_id, item_name) VALUES (?,?)";
    await promisePool.query(sql,[listID,listItem]);
}

//delete list item
const deleteListItem = async (promisePool,listID,listItem) => {
    const sql= "DELETE FROM list_items WHERE list_id = ? AND item_name = ?"; 
    await promisePool.query(sql,[listID,listItem]);
}

module.exports = { 
    createUser,
    findUser,
    getLists, 
    createList,
    deleteList,
    addListItem,
    deleteListItem,
    saveRefreshToken,
    getRefreshToken,
    delRefreshToken
};