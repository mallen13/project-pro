
//get all lists
const getLists = async promisePool => {

    //create lists
    const lists = [];

    //query database
    const sql = ' \
        SELECT list_names.list_id, list_names.list_name, list_items.item_name \
        FROM list_names \
        LEFT JOIN list_items \
        ON list_names.list_id = list_items.list_id \
        ORDER BY list_names.list_id \
    ';
    const [ listsQuery ] = await promisePool.query(sql);

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
        else if (hasList) {
            const index = lists.findIndex( list => list.id === listItem.list_id );
            lists[index].items.push(listItem.item_name);
        }
    })

    return lists;
}

//create new list
const createList = async (promisePool,listTitle) => {
    const sql = "INSERT INTO list_names (list_name) VALUES ('" + listTitle + "')";
    await promisePool.query(sql);
}

//delete list
const deleteList = async (promisePool,listID, hasItems) => {
    let sql; 

    hasItems 
        ? sql = ' \
        DELETE list_items,list_names FROM list_items \
        LEFT OUTER JOIN list_names ON list_names.list_id = list_items.list_id \
        WHERE list_items.list_id = ' + listID
        : sql = 'DELETE FROM list_names WHERE list_id = ' + listID;

        await promisePool.query(sql);
}

//add list item
const addListItem = async (promisePool,listID,listItem) => {
    const sql = "INSERT INTO list_items (list_id, item_name) VALUES (" + listID + ", '" + listItem + "')";
    console.log(sql);
    await promisePool.query(sql);
}

//delete list item
const deleteListItem = async (promisePool,listID, listItem) => {
    const sql= "DELETE FROM list_items WHERE list_id = " 
    + listID + " AND item_name = '" + listItem + "'"; 
    promisePool.query(sql);
}

module.exports = { 
    getLists, 
    createList,
    deleteList,
    addListItem,
    deleteListItem,
};