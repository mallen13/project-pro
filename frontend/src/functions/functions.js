
export const getData = async url => {
    try {
        const resp = await fetch(url);
        const data = await resp.json();
        console.log(data);
        return data;
    } catch (err) {
        return 'error'
    }
    
}

export const postData = async (body,url) => {
    try {
        const settings = {
            method: 'POST',
            headers: {'content-type' : 'application/json'},
            body: JSON.stringify(body)
        }
        const resp = await fetch(url, settings);
        const data = await resp.json();
        return data;
    } catch (err) {
        return 'error';
    }
}