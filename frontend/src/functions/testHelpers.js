export const mockFetch = resolve => {
    global.fetch = () =>
    Promise.resolve({
      json: ()=> Promise.resolve(resolve)
    })
}