import { getData,postData } from './functions';
import { mockFetch } from './testHelpers';

describe('fetch-get', ()=> {
     //get fetch before mock
     const unmockedFetch = global.fetch;

     //reset fetch after each
     afterAll(()=> global.fetch = unmockedFetch);

    it('returns data with get request', async () => {
        mockFetch('it worked');
        const fetch = await getData();
        expect(fetch).toBe('it worked');
    });

    it('returns error if get fails', async () => {
        //mockFetch('it worked'); mock failed fetch
        global.fetch = () => Promise.reject('err');

        const fetch = await getData();
        expect(fetch).toBe('error');
    });
})

describe('fetch-post', ()=> {
    it('returns data with post request' , async () => {
        mockFetch('it worked');
        const fetch = await postData();
        expect(fetch).toBe('it worked');
    });
    it('returns error if post fails', async () => {
        global.fetch = () => Promise.reject("it didn't work");
        const fetch = await postData();
        expect(fetch).toBe('error');
    });
})

test('mock fetch works', async () => {
    mockFetch('test');

    const resp = await fetch();
    const data = await resp.json();
    
    expect(data).toBe('test');
})


