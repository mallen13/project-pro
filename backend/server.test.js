const request =  require('supertest');
const server = require('./server.js');
const mysql = require('mysql2');

//create user
const createUser = async () => {
    await request(server)
    .post('/list-app/register')
    .send({
        user: {
            name: 'Matt',
            email: 'test@test.com', 
            password: 'test12345'
        },
    })
}

//login 
const login = async () => {
    const resp = await request(server)
    .post('/list-app/login')
    .send({
        email: 'test@test.com',
        password: 'test12345'
    })
    return resp.body.accessToken;
}

//delete user
const deleteUser = async () => {
    await promisePool.query('DELETE FROM list_items');
    await promisePool.query('DELETE FROM list_names');
    await promisePool.query('DELETE FROM users');
    await promisePool.query('DELETE FROM tokens');
    await promisePool.query('ALTER TABLE users AUTO_INCREMENT = 0');
    await promisePool.query('ALTER TABLE list_names AUTO_INCREMENT = 0');
}

//setup db connection
const pool = mysql.createPool({
    host : '127.0.0.1',
    user : process.env.DB_USER,
    password: process.env.DB_PW,
    database: 'mattallen_list_app'
});
const promisePool = pool.promise();

jest.spyOn(global.console, 'error').mockImplementation( ()=> null);

afterAll( async () => await deleteUser() )

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

describe('POST /list-app/register', ()=> {

    beforeAll( ()=> deleteUser())

    it('returns success with email and password', async ()=> {
        //arrange
        const resp = await request(server)
            .post('/list-app/register')
            .send({
                user: {
                    name: 'Matt',
                    email: 'test@test.com', 
                    password: 'test12345'
                },
            })

        expect(resp.statusCode).toBe(201);
    });

    it('returns err with duplicate entry', async ()=> {
        //post duplicate
        const resp = await request(server)
            .post('/list-app/register')
            .send({
                user: {
                    name: 'Matt',
                    email: 'test@test.com', 
                    password: 'test12345'
                },
            })

        expect(resp.statusCode).toBe(500);
    });
    
    it('returns an err w/ no request body', async()=> {
        //arrange
        const resp = await request(server)
            .post('/list-app/register');
        expect(resp.statusCode).toBe(400);
    })

    it('returns an err w/ no email', async ()=> {
        const resp = await request(server)
            .post('/list-app/register')
            .send({
                user: {
                    name: 'Matt',
                    password: 'test12345'
                },
            })

            expect(resp.statusCode).toBe(400);
    });

    it('returns an err w/ invalid email', async ()=> {
        const resp = await request(server)
            .post('/list-app/register')
            .send({
                user: {
                    name: 'Matt',
                    email: 'badEmail',
                    password: 'test12345'
                },
            })

            expect(resp.statusCode).toBe(400);
    });

    it('return an err w/ no password', async ()=> {
        const resp = await request(server)
            .post('/list-app/register')
            .send({
                user: {
                    name: 'Matt',
                    email: 'email@email.com'
                }
            })

            expect(resp.body).toEqual({status: 'invalid password'});
    });

    it('return an err w/ bad password', async ()=> {
        const resp = await request(server)
            .post('/list-app/register')
            .send({
                user: {
                    name: 'Matt',
                    password: '',
                    email: 'test@test.com'
                },
            })

            expect(resp.body).toEqual({status: 'invalid password'});
    });

    it.skip('return an err w/ hashing fail', async ()=> {
        const resp = await request(server)
            .post('/list-app/register')
            .send({
                user: {
                    name: 'Matt',
                    password: '',
                    email: 'test@test.com'
                },
            })

        expect(resp.status).toBe('500');

    });
})

describe('POST /list-app/login', () => {

    //create user
    beforeAll( async () => await createUser());

    it('returns 200 with valid authentication', async ()=> {
        const resp = await request(server)
            .post('/list-app/login')
            .send({
                email: 'test@test.com',
                password: 'test12345'
            })

        expect(resp.statusCode).toBe(200)
    });

    it('returns err w/ invalid username', async ()=> {
        const resp = await request(server)
            .post('/list-app/login')
            .send({
                email: 'test',
                password: 'test12345'
            })

        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({status: 'invalid username or password'});
    });

    it('returns an err w/ invalid password', async ()=> {
        const resp = await request(server)
        .post('/list-app/login')
        .send({
            email: 'test@test.com',
            password: 'test'
        })

        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({status: 'invalid username or password'});
    });

    it('returns an err w/ sql err trying to query user', async ()=> {

      //change column name to trigger query err
      await promisePool.query('ALTER TABLE users RENAME COLUMN email TO login');

        const resp = await request(server)
        .post('/list-app/login')
        .send({
            email: 'test@test.com',
            password: 'test'
        })

        //change back
        await promisePool.query('ALTER TABLE users RENAME COLUMN login TO email');

        expect(resp.statusCode).toBe(500);
        expect(resp.body).toHaveProperty('status');
    });
  
    it('returns an err w/ sql err trying to save refresh token', async ()=> {

        //change column name to trigger query err
        await promisePool.query('ALTER TABLE tokens RENAME COLUMN token TO tolkien');
  
        const resp = await request(server)
        .post('/list-app/login')
        .send({
            email: 'test@test.com',
            password: 'test12345'
        })
  
        //change back
        await promisePool.query('ALTER TABLE tokens RENAME COLUMN tolkien TO token');

        expect(resp.statusCode).toBe(500);
        expect(resp.body).toEqual({status: 'err saving refresh token to DB'});
      });
})

describe('POST /list-app/get-access-token', ()=> {
    //if null 
    it('returns 403 without a refresh token', async ()=> {
        const resp = await request(server)
            .post('/list-app/get-access-token')

        expect(resp.statusCode).toBe(403)
        expect(resp.body).toEqual({status: 'no token recieved'})
    });

    //if not in db
    it('returns 403 without a refresh token', async ()=> {
        const resp = await request(server)
            .post('/list-app/get-access-token')
            .send({refreshToken: 'abc'})

        expect(resp.statusCode).toBe(500)
        expect(resp.body).toEqual({status: "token doesn't exist"})
    });

    //if invalid token -> 403 
    it('returns 500 if token not in db', async ()=> {
        const resp = await request(server)
            .post('/list-app/get-access-token')
            .send({refreshToken: '12345'})

        expect(resp.statusCode).toBe(500)
        expect(resp.body).toEqual({status: "token doesn't exist"})
    });

    //if token verify err
    it('returns 403 without token verify err', async ()=> {
        await promisePool.query('INSERT INTO tokens(token,id) VALUES (12345,1)');
        const resp = await request(server)
            .post('/list-app/get-access-token')
            .send({refreshToken: 12345})

        expect(resp.statusCode).toBe(403)

        await promisePool.query('DELETE FROM tokens');
    });

    //if valid token
    it('returns 200 with valid token', async ()=> {
        await promisePool.query('INSERT INTO TOKENS(token,id) VALUES("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6IkRlbW8gVXNlciIsImVtYWlsIjoiZGVtb0BkZW1vLmNvbSIsImlhdCI6MTY2MzUzMTc2OH0.snI2x8Y94KW62aW5T91vnLfL_EnIP56Hmt3IbySkkGk",1)');
        const resp = await request(server)
            .post('/list-app/get-access-token')
            .send({refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6IkRlbW8gVXNlciIsImVtYWlsIjoiZGVtb0BkZW1vLmNvbSIsImlhdCI6MTY2MzUzMTc2OH0.snI2x8Y94KW62aW5T91vnLfL_EnIP56Hmt3IbySkkGk'})

        expect(resp.statusCode).toBe(201)
        expect(resp.body).toHaveProperty('token')

        await promisePool.query('DELETE FROM tokens');
    });

    //if db err -> 500 'err removing from db'
    it('returns 500 with db err', async ()=> {
        await promisePool.query('ALTER TABLE tokens RENAME COLUMN token TO tolkien');
        const resp = await request(server)
            .post('/list-app/get-access-token')
            .send({refreshToken: '12345'})

        expect(resp.statusCode).toBe(500)
        expect(resp.body).toEqual({status: 'err fetching from db'})

        await promisePool.query('ALTER TABLE tokens RENAME COLUMN tolkien TO token');
    });
})

describe('POST /list-app/logout', ()=> {
    //no token -> 403 'no token recieved'
    it('returns 403 with no id', async ()=> {
        const resp = await request(server)
            .post('/list-app/logout')

        expect(resp.statusCode).toBe(403)
        expect(resp.body).toEqual({status: 'no id recieved'})
    });

    //success
    it('returns 201 with successful remove', async ()=> {
        const resp = await request(server)
            .post('/list-app/logout')
            .send({id: 1})

        expect(resp.statusCode).toBe(201)
        expect(resp.body).toEqual('success')

    });

    //db err
    it('returns 500 with DB error', async ()=> {
        await promisePool.query('ALTER TABLE tokens RENAME TO tolkiens');
        const resp = await request(server)
            .post('/list-app/logout')
            .send({id: 12345})

        expect(resp.statusCode).toBe(500)
        expect(resp.body).toHaveProperty('status')

        await promisePool.query('ALTER TABLE tolkiens RENAME TO tokens')
    });
})

describe('GET /list-app/get-lists', ()=> {

    let token;

    beforeAll( async ()=> {
        await createUser();
        token = await login();
    })

    afterAll( async ()=> {
        await deleteUser()
    })

    it('responds with an empty array of lists', async ()=> {

         //add new list
        const resp = await request(server)
            .get('/list-app/get-lists')
            .set('Authorization','Bearer ' + token);

        expect(resp.statusCode).toBe(200);
        expect(resp.body.lists).toEqual([]);

    })

    it('adds items and responds with an array of lists', async ()=> {

        //add new list
       await promisePool.query("INSERT INTO list_names (list_name,user_id) VALUES ('list','1')");

        //add list w/o items
        await request(server)
            .get('/list-app/get-lists')
            .set('Authorization', 'Bearer ' + token);

        //add list items
        const sql1= "INSERT INTO list_items (list_id, item_name) VALUES (1,'do something')";
        const sql2= "INSERT INTO list_items (list_id, item_name) VALUES (1,'do something else')";
        await promisePool.query(sql1);
        await promisePool.query(sql2);

        const resp = await request(server)
            .get('/list-app/get-lists')
            .set('Authorization', 'Bearer ' + token);

        expect(resp.status).toBe(200);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toHaveProperty('lists');
    })

    it('responds with an err if no token', async ()=> {
        const resp = await request(server)
            .get('/list-app/get-lists')
        
        expect(resp.status).toBe(401);
    });

    it('responds with an err if bad credentials', async ()=> {
        const resp = await request(server)
            .get('/list-app/get-lists')
            .set('Authorization', 'Bearer badCode')

        expect(resp.status).toBe(403);
    });

    it('responds w/ error msg if mysql query error', async ()=> {

        //change column name to trigger query err
       await promisePool.query('ALTER TABLE list_names RENAME COLUMN list_name TO name');

        const resp = await request(server)
            .get('/list-app/get-lists')
            .set('Authorization', 'Bearer ' + token)

        //rename column
        await promisePool.query('ALTER TABLE list_names RENAME COLUMN name TO list_name');

        expect(resp.status).toBe(500);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toHaveProperty('status');

    })
})

describe('POST /list-app/create-list', ()=> {

    let token;

    beforeAll( async ()=> {
        await createUser();
        token = await login();
    })

    it('responds with status 201 and a success JSON message', async ()=> {
        const resp = await request(server)
            .post('/list-app/create-list')
            .send({listTitle: 'new list'})
            .set('Authorization','Bearer ' + token);

        expect(resp.status).toBe(201);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toHaveProperty('listId')

    })

    it('responds with status 500 and err msg if already exists', async ()=> {

        //attempt duplicate post
        const resp = await request(server)
            .post('/list-app/create-list')
            .send({listTitle: 'new list'})
            .set('Authorization','Bearer ' + token);

        expect(resp.status).toBe(500);
        expect(resp.type).toBe('application/json');
        expect(resp.body.status).toMatch(/duplicate entry/i);
    });
})

describe('POST /list-app/delete-list', ()=> {

    let token;

    beforeAll( async ()=> {
        await createUser();
        token = await login();
    })

    it('w/ list items, responds with status 200', async ()=> {
        //delete list
        const resp = await request(server)
            .post('/list-app/delete-list')
            .send({list: {
                id: 1,
                items: ['item1']
            }})
            .set('Authorization','Bearer ' + token);

        expect(resp.status).toBe(200);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toBe('success');
    })

    it('w/o list items responds with status 200', async ()=> {

        //create list
        await promisePool.query("INSERT INTO list_names (list_name,user_id) VALUES ('list',1)");

        const resp = await request(server)
            .post('/list-app/delete-list')
            .send({list: {
                id: 1,
                items: []
            }})
            .set('Authorization','Bearer ' + token);

        expect(resp.status).toBe(200);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toBe('success');
    })

    it('responds with status 500 if server err and err status', async ()=> {

        //send w/o list id
        const resp = await request(server)
            .post('/list-app/delete-list')
            .send()
            .set('Authorization','Bearer ' + token);

        expect(resp.status).toBe(500);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toHaveProperty('status');
    });
})

describe('POST /list-app/add-list-item', ()=> {

    let token;

    beforeAll( async ()=> {
        await deleteUser();
        await createUser();
        token = await login();
    })

    it('responds with status 200 and success msg', async ()=> {

        await promisePool.query("INSERT INTO list_names (list_name,user_id) VALUES ('list',1)");
        
        const resp = await request(server)
            .post('/list-app/add-list-item')
            .send({
                listID: 1,
                listItem: 'do something'
            })
            .set('Authorization','Bearer ' + token);

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
            .set('Authorization','Bearer ' + token);

        expect(resp.status).toBe(500);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toHaveProperty('status');
    })
})

describe('POST /list-app/delete-list-item', ()=> {

    let token;

    beforeAll( async ()=> {
        await createUser();
        token = await login();
    })
    
    it('responds with 200 and JSON success msg', async ()=> {
        const resp = await request(server)
            .post('/list-app/delete-list-item')
            .send({
                listID: 1,
                listItem: 'do something'
            })
            .set('Authorization','Bearer ' + token);

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
            .set('Authorization','Bearer ' + token);

        expect(resp.type).toBe('application/json');
        expect(resp.status).toBe(500);
        expect(resp.body).toHaveProperty('status');
    })
})