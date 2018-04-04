const jwt = require('jsonwebtoken');
const algorithm = 'HS512';
const secret = 'koelnerdom';
const Promise = require('bluebird');

module.exports = {
	showSecret: function () {
		return secret;
	},
	getRootCreds: function () {
		return require('./root_user.json');
	},
	encryptPassword: function (password) {
		return jwt.sign(password, secret, { algorithm });
	},
	_decryptPassword: function (encrypted_password, callback) {
		return jwt.verify(encrypted_password, secret, callback);
	}
};

module.exports.decryptPassword = Promise.promisify(module.exports._decryptPassword);
