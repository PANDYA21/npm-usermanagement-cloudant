const User = require('./user');
const db = require('./modules/db').db;
const Promise = require('bluebird');

for (let key in db) {
	if (typeof db[key] === 'function') {
		db[key + 'Async'] = Promise.promisify(db[key]);
	}
}

module.exports = {
	createUser: async function (user_props) {
		let user = new User(user_props);
		return await db.createAsync(user);
	},
	getUser: async function (username) {
		return await db.getAsync(username)
	},
	editUser: async function (user_props) {

	},
	setUserInactive: async function (username) {

	},
	deleteUser: async function (username) {
		return module.exports.setUserInactive(username);
	},
	getAllUsers: async function () {

	}
}

module.exports.getUser({ username: 'abc@domain.de'})
	.catch(console.error)
	.then(console.log);
