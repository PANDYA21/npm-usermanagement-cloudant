const User = require('./modules/user');
const DB = require('./modules/db');
const Promise = require('bluebird');
const authentication = require('./modules/authentication');

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

	async getUser(username) {
		return await this.db.get(username);
	}

	async updateUser(user) {
		return await this.db.update(user);
	}

	async setUserActive(username) {
		let user = await this.db.get(username);
		user.active = true;
		return await this.updateUser(user);
	}

	async setUserInactive(username) {
		let user = await this.db.get(username);
		user.active = false;
		return await this.updateUser(user);
	}

	async deleteUser(username) {
		return await this.setUserInactive(username);
	}

	async authenticateUser(username, password) {
		let user = await this.getUser(username);
		let correct_password = await authentication.decryptPassword(user.password);
		if (password === correct_password) {
			return {
				success: true,
				message: 'authentication successful'
			};
		} else {
			return {
				success: false,
				error: 'passwords do not match'
			};
		}
	}

	async getAllUsers(params) {
		return this.db.get('_all_docs', params);
	}

	async getActiveUsers() {
		return this.db.find({
			selector: { active: true }
		});
	}

	async createIndexForActiveKey() {
		this.db.createIndex({
			name: 'active',
			type: 'json',
			index: {
				fields: ['active']
			}
		})
	}
}


module.exports = Usermanagement;


/* Examples */
// process.env.VCAP_SERVICES = JSON.stringify({
// 	cloudantNoSQLDB: [{
// 		credentials: {
// 			"username": "6c6158d4-459e-4bbb-a834-cc101c84a56c-bluemix",
// 			"password": "da7f12c43f32fe20a404c044c49502e8a96dd69fc982f2064e2828e1e0e3c4cf",
// 			"host": "6c6158d4-459e-4bbb-a834-cc101c84a56c-bluemix.cloudant.com",
// 			"port": 443,
// 			"url": "https://6c6158d4-459e-4bbb-a834-cc101c84a56c-bluemix:da7f12c43f32fe20a404c044c49502e8a96dd69fc982f2064e2828e1e0e3c4cf@6c6158d4-459e-4bbb-a834-cc101c84a56c-bluemix.cloudant.com"
// 		}
// 	}]
// });

// let usermanagement = new Usermanagement();
// usermanagement.createUser({ username: 'bhaumik.pandya@bluetrade.de', password: 'abcDEF@123' })
// 	.catch(console.error)
// 	.then(d => console.log(JSON.stringify(d, null, 2)));

// usermanagement.setUserActive('bhaumik.pandya@bluetrade.de')
// 	.catch(console.error)
// 	.then(d => console.log(JSON.stringify(d, null, 2)));

// usermanagement.authenticateUser('bhaumik.pandya@bluetrade.de', 'abc@123')
// 	.catch(console.error)
// 	.then(d => console.log(JSON.stringify(d, null, 2)));

// usermanagement.getActiveUsers()
// 	.catch(console.error)
// 	.then(d => console.log(JSON.stringify(d, null, 2)));
