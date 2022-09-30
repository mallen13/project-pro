export const mockFetch = (resolve,status = 200) => {
    global.fetch = () =>
    Promise.resolve({
      json: ()=> Promise.resolve(resolve),
      status: status
    })
}

export const setLocalStorage = () => {
  //set local storage -> set a user/refresh token
  const storedUser = {
    rToken: '12345.12345.12345',
    id: '12345',
    name: 'Steve McDemo',
    email: 'steveMcDemo@fake.com'
  }
  window.localStorage.setItem('list-app-user',JSON.stringify(storedUser));
}