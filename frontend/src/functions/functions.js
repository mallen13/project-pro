
export const getData = async (url,token) => {
    try {
        const settings = {
            method: 'GET',
            headers: {
                'content-type' : 'application/json',
                'authorization' : 'token ' + token
            }
        }
        const resp = await fetch(url,settings);

        if (resp.status === 403) return 'invalid token';
        const data = await resp.json();
        return data
    } catch (err) {
        return 'error'
    }
}

export const postData = async (body,url,token ='') => {
    try {
        const settings = {
            method: 'POST',
            headers: {
                'content-type' : 'application/json',
                'authorization' : 'token ' + token
            },
            body: JSON.stringify(body)
        }
        const resp = await fetch(url, settings);
        if (resp.status === 403)
            return 'invalid token';
    
        const data = await resp.json();
        return data;
    } catch (err) {
        return 'error';
    }
}

export const isValidEmail = email => {
    const pattern = /^[-!#$%&'*+0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    return pattern.test(email);
}

export const isValidPassword = password => {
    const upperCase = /[A-Z]/.test(password);
    const lowerCase = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const specialChar = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>?~]/.test(password);
    const length = password.length >=5;

    if (!upperCase || !lowerCase || !specialChar || !length || !number) return false;
    return true;
}

export const getStoredUser= async () => {
    //get user from local storage
    const storedUser = JSON.parse(localStorage.getItem('list-app-user'));

    //exchange refresh token for access token
    if (storedUser) {
      const url = 'https://mattallen.tech/list-app/get-access-token'; 
      //const url = 'http://localhost:8080/list-app/get-access-token';
      const data = await postData({refreshToken: storedUser.rToken},url);
      if (data.token) {
        storedUser.aToken = data.token;
        return storedUser;
      }
    }

    return 'no user';
}