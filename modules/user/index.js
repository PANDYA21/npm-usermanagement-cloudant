const authentication_methods = require('../authentication');
const required_params = ['username', 'password']; // 'role' could be added here
const min_password_length = 6;

module.exports = class User {
	constructor() {
		this.username = arguments[0]['username'];
		this.password = arguments[0]['password'];
		for (let required_param of required_params) {
			if (typeof this[required_param] === 'undefined' || this[required_param] === '') {
				throw new Error('Missing required parameter: ' + required_param);
			}
		}
		this.validateUser();
		this.validatePassword();
		this.password = authentication_methods.encryptPassword(this.password);
		this.role = arguments[0]['role'];
		this.username = this.username.toLowerCase();
		this.created = (new Date()).toUTCString();
		this.createdUnix = (new Date()).getTime();
		this.active = true;
		this.role = (this.role === 'root') ? this.role : 'user';
	}

	validateUser() {
		// check if valid email
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (re.test(this.username)) {
			return true;
		} else {
			let e = new Error('Invalid username. Please provide a valid email address.');
			throw e;
		}
	}

	validatePassword() {
		// basic password policy:
		let regexes = [
			/.*[A-Z]+.*/g,
			/.*[a-z]+.*/g,
			/.*[0-9]+.*/g,
			/.*[!@#$%^&*]+.*$/
		];
		let total = 0;
		for (let regex of regexes) {
			if ((regex).test(this.password)) {
				total++;
			}
		}

		if (total !== regexes.length && this.password.length >= min_password_length) {
			throw new Error(`Password not safe enough. \nPassword requires at least: \none capital letter \none small letter \none digit \none special character \nminimum length of ${min_password_length}. \n`);
		}
	}
}
