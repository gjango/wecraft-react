const LOCALSTORAGE_AUTH_KEY = "authToken"

const authToken = {
  get() {
    return localStorage.getItem(LOCALSTORAGE_AUTH_KEY)
  },
  set(token) {
    return localStorage.setItem(LOCALSTORAGE_AUTH_KEY, token)
  },
  remove() {
    return localStorage.removeItem(LOCALSTORAGE_AUTH_KEY)
  }
}

export default authToken
