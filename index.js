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
			let err = {
				success: false,
				error: 'passwords do not match'
			};
			err.prototype = Error;
			throw err;
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

	async syncRootUser() {
		let root_user = require('./modules/user/root_user');
		return await this.createUser(root_user);
	}
}

module.exports = Usermanagement;
