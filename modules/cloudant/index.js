const Cloudant = require('@cloudant/cloudant');
const Promise = require('bluebird');
const required_parameters = ['username', 'password', 'url'];
const default_dbname = 'users';

class DB {
	constructor() {
		if (arguments.length === 0) {
			throw new Error('Missing required parameters: username, password');
		}
		this.username = arguments[0].username;
		this.password = arguments[0].password;
		this.url = arguments[0].url;
		this.port = arguments[0].port;
		this.host = arguments[0].host;
		this.dbname = arguments[0].dbname || default_dbname;

		for (let param of required_parameters) {
			if (typeof this[param] === 'undefined') {
				throw new Error('Missing required parameter: ' + param);
			}
		}

		this.setDb();
	}

	setDb() {
		this.cloudant = Cloudant({
			username: this.username,
			password: this.password,
			url: this.url,
			host: this.host,
			port: this.port
		});
		this.db = this.cloudant.db;
		this.use();
	}

	use() {
		this.db = this.db.use(this.dbname);
	}

	insertDocAsync(doc, id, cb) {
		cb = cb || id;
		typeof id === 'function' ? id = undefined : null;
		this.db.insert(doc, id, (err, body, header) => {
			err ? cb(err, null) : cb(null, body);
		});
	}

	async insertDoc(doc, id) {
		return await ((Promise.promisify(this.insertDocAsync)).bind(this))(doc, id);
	}

	getDocAsync(id, cb) {
		return this.db.get(id, (err, result) => {
			err ? cb(err, null) : cb(null, result);
		});
	}

	async getDoc(id) {
		return await ((Promise.promisify(this.getDocAsync)).bind(this))(id);
	}

	
}

// let db = new DB({
// 	"username": "6c6158d4-459e-4bbb-a834-cc101c84a56c-bluemix",
// 	"password": "da7f12c43f32fe20a404c044c49502e8a96dd69fc982f2064e2828e1e0e3c4cf",
// 	"host": "6c6158d4-459e-4bbb-a834-cc101c84a56c-bluemix.cloudant.com",
// 	"port": 443,
// 	"url": "https://6c6158d4-459e-4bbb-a834-cc101c84a56c-bluemix:da7f12c43f32fe20a404c044c49502e8a96dd69fc982f2064e2828e1e0e3c4cf@6c6158d4-459e-4bbb-a834-cc101c84a56c-bluemix.cloudant.com"
// });
// db.insertDoc({ data: 'jkl' }, 'jkl')
// 	.catch(console.error)
// 	.then(console.log);

