import Http from '@/lib/Http'

class Auth {
	constructor (data) {
		this.data = data
	}
	login () {
    // axios.post('/api/login', this.data)
    // .then((response) => {
    //   console.log(response)
    // })
    // .catch((errors) => {
    //   console.log(errors)
    // })
}
register () {
	return new Promise((resolve, reject) => {
		Http.post('register', this.data)
		.then((response) => {
			resolve(response);
		})
		.catch(errors => {
			let errorObj = {};
			for(let error in errors){
				if (errors.hasOwnProperty(error)) {
					if( errors[error].email ){
						errorObj['data'] = {email: errors[error].email.properties.message};	
					}else{
						errorObj['data'] = errors[error];	
					}
					
				}
			}
			reject(errorObj);
		})
	})  
}
getToken () {}
logout () {}
loggedIn () {}
}

export default Auth
