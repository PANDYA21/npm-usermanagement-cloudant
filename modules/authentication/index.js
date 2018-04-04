const jwt = require('jsonwebtoken');
const algorithm = 'HS512';
const secret = 'koelnerdom';

module.exports = {
	showSecret: function () {
		return secret;
	},
	getCreds: function () {
		return require('./root_user.json');
	},
	encryptPassword: function (password) {
		return jwt.sign(password, secret, { algorithm });
	},
	decryptPassword: function (encrypted_password, callback) {
		return jwt.verify(encrypted_password, secret, callback);
	}
};
