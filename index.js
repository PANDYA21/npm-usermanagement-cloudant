const User = require('./modules//user');
const DB = require('./modules/cloudant');
const Promise = require('bluebird');

class Usermanagement {
	constructor() {
		try {
			this.creds = JSON.parse(process.env.cloudant_creds);
		} catch (e) {
			console.warn('process.env.cloudant_creds not set. Trying with process.env.VCAP_SERVICES');
			try {
				let VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES);
				this.creds = VCAP_SERVICES.cloudantNoSQLDB[0].credentials;
			} catch (e) {
				throw new Error('Could not fetch cloduant credential details from environment.');
			}
		}
		this.db = new DB(this.creds);
	}

	async createUser(user) {
		this.user = new User(user);
		return await this.db.insert(this.user, this.user.username);
	}
}

process.env.VCAP_SERVICES = JSON.stringify({
	cloudantNoSQLDB: [{
		credentials: {
			"username": "6c6158d4-459e-4bbb-a834-cc101c84a56c-bluemix",
			"password": "da7f12c43f32fe20a404c044c49502e8a96dd69fc982f2064e2828e1e0e3c4cf",
			"host": "6c6158d4-459e-4bbb-a834-cc101c84a56c-bluemix.cloudant.com",
			"port": 443,
			"url": "https://6c6158d4-459e-4bbb-a834-cc101c84a56c-bluemix:da7f12c43f32fe20a404c044c49502e8a96dd69fc982f2064e2828e1e0e3c4cf@6c6158d4-459e-4bbb-a834-cc101c84a56c-bluemix.cloudant.com"
		}
	}]
});

let usermanagement = new Usermanagement();
usermanagement.createUser({ username: 'bhaumik.pandya@bluetrade.de', password: 'abc@123' })
	.catch(console.error)
	.then(d => console.log(JSON.stringify(d, null, 2)));
