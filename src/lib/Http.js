class Http {
  static get() {}
	static post(url, data) {
		return new Promise((resolve, reject) => {
			axios.post(API_URL + url, data)
			.then(response => {
				resolve(response.data)
			})
			.catch(error => {
				reject(error.response.data)
			})
		})
	}
	static put() {}
	static delete() {}
}

export default Http