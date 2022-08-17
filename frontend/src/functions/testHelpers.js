export const mockFetch = (resolve,status = 200) => {
    global.fetch = () =>
    Promise.resolve({
      json: ()=> Promise.resolve(resolve),
      status: status
    })
}