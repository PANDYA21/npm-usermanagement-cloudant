process.env.VCAP_SERVICES = JSON.stringify({
	cloudantNoSQLDB: [{
		credentials: require('./cloudant_creds')
	}]
});

const Usermanagement = require('.');
let usermanagement = new Usermanagement();
usermanagement.syncRootUser()
	.catch(err => err ? console.error(err) : null)
	.then(d => console.log(JSON.stringify(d, null, 2)));
