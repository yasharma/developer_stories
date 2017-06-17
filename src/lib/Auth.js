/* global axios */
class Auth {
  constructor (data) {
    this.data = data
  }
  login () {
    axios.post('/api/login', this.data)
    .then((response) => {
      console.log(response)
    })
    .catch((errors) => {
      console.log(errors)
    })
  }
  getToken () {}
  logout () {}
  loggedIn () {}
}

export default Auth
