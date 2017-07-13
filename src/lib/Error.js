class Errors {
	constructor() {
		this.errors = {};
	}

	get(field) {
		if (this.errors[field]){
			return this.errors[field];
		}
	}

	clear(field) {
		if(field) {
			delete this.errors[field];
			return;
		}	
		this.errors = {};
	}

	has(field) {
		return this.errors.hasOwnProperty(field);
	}
	any() {
		return Object.keys(this.errors).length > 0; 
	}

	record(errors){
		this.errors = errors;
	}
}

export default Errors;