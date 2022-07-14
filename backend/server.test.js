const request =  require('supertest');
const server = require('./server.js');
const mysql = require('mysql2');

//setup db connection
const pool = mysql.createPool({
    host : '127.0.0.1',
    user : process.env.DB_USER,
    password: process.env.DB_PW,
    database: 'mattallen_list_app'
});

const promisePool = pool.promise();

//before each
afterEach( async ()=> {
    //clear lists
    await promisePool.query('DELETE FROM list_items');
    await promisePool.query('DELETE FROM list_names');

    //reset auto-increment id
    await promisePool.query('ALTER TABLE list_names AUTO_INCREMENT = 0');

    //create a new list
    await request(server)
        .post('/list-app/create-list')
        .send({listTitle: 'test'});
})

//clear table after all
afterAll( async ()=> await promisePool.query('DELETE FROM list_names'))

//void console.err
jest.spyOn(global.console, 'error').mockImplementation( ()=> null);

describe('GET /list-app/status', ()=>{
    it('responds w/ JSON message and 200 code', async ()=> {
        const resp = await request(server)
            .get('/list-app/status')
            .set('Accept', 'application/json');

        expect(resp.body).toEqual('API is working! :)');
        expect(resp.status).toEqual(200);
        expect(resp.type).toBe('application/json');
    })
})

describe('GET /list-app/get-lists', ()=> {
    it('responds with an array of lists', async ()=> {
        const resp = await request(server)
            .get('/list-app/get-lists');
        expect(resp.status).toBe(200);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toHaveProperty('lists');
    })

    it('adds items and responds with an array of lists', async ()=> {

        const sql1= "INSERT INTO list_items (list_id, item_name) VALUES (1,'do something')";
        const sql2= "INSERT INTO list_items (list_id, item_name) VALUES (1,'do something else')";

        await promisePool.query(sql1);
        await promisePool.query(sql2);

        const resp = await request(server)
            .get('/list-app/get-lists');
        expect(resp.status).toBe(200);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toHaveProperty('lists');
    })
})

describe('POST /list-app/create-list', ()=> {

    it('responds with status 201 and a success JSON message', async ()=> {
        const resp = await request(server)
            .post('/list-app/create-list')
            .send({listTitle: 'new list'});

        expect(resp.status).toBe(201);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toBe('success');

    })

    it('responds with status 500 and err msg if already exists', async ()=> {

        //attempt duplicate post
        const resp = await request(server)
            .post('/list-app/create-list')
            .send({listTitle: 'test'});

        expect(resp.status).toBe(500);
        expect(resp.type).toBe('application/json');
        expect(resp.body.status).toMatch(/duplicate entry/i);
    });
})

describe('POST /list-app/delete-list', ()=> {

    it('responds with status 200 and a success JSON message', async ()=> {
        //delete list
        const resp = await request(server)
            .post('/list-app/delete-list')
            .send({list: {
                id: 1,
                items: ['item1']
            }});

        expect(resp.status).toBe(200);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toBe('success');
    })

    it('responds with status 200 and a success JSON message', async ()=> {
        //delete list
        const resp = await request(server)
            .post('/list-app/delete-list')
            .send({list: {
                id: 1,
                items: []
            }});

        expect(resp.status).toBe(200);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toBe('success');
    })

    it('responds with status 500 if server err and err status', async ()=> {

        //send w/o list id
        const resp = await request(server)
            .post('/list-app/delete-list')
            .send();

        expect(resp.status).toBe(500);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toHaveProperty('status');
    });
})

describe('POST /list-app/add-list-item', ()=> {

    //clear list items
    afterEach( ()=> {
        const sql= "DELETE FROM list_items WHERE list_id = 1 AND item_name = 'do something' ";
        promisePool.query(sql);
    })

    it('responds with status 200 and success msg', async ()=> {
        const resp = await request(server)
            .post('/list-app/add-list-item')
            .send({
                listID: 1,
                listItem: 'do something'
            })

        expect(resp.status).toBe(200);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toBe('success');
    })

    it('responds with status 500 and err msg', async ()=> {
        const resp = await request(server)
            .post('/list-app/add-list-item')
            .send({
                listID: 2,
                listItem: 'do something'
            })

        expect(resp.status).toBe(500);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toHaveProperty('status');
    })
})

describe('POST /list-app/delete-list-item', ()=> {
    it('responds with 200 and JSON success msg', async ()=> {
        const resp = await request(server)
            .post('/list-app/delete-list-item')
            .send({
                listID: 1,
                listItem: 'do something'
            })

        expect(resp.type).toBe('application/json');
        expect(resp.status).toBe(200);
        expect(resp.body).toBe('success');
    })

    it('responds with 500 and JSON err msg', async ()=> {
        const resp = await request(server)
            .post('/list-app/delete-list-item')
            .send({
                listID: 'badID',
                listItem: 'do something'
            })

        expect(resp.type).toBe('application/json');
        expect(resp.status).toBe(500);
        expect(resp.body).toHaveProperty('status');
    })
})