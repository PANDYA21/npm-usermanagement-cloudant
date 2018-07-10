process.env.VCAP_SERVICES = JSON.stringify({
	cloudantNoSQLDB: [{
		name: 'myCloudant',
		credentials: require('./cloudant_creds')
	}]
});

const Usermanagement = require('.');
let usermanagement = new Usermanagement({ db_name: 'myCloudant' });

async function testIt() {
	try {
		await usermanagement.syncRootUser();
	} catch(err) {
		console.error(err);
	}
	return usermanagement.getUser('root@root.root');
}

testIt()
	.catch(err => err ? console.error(err) : null)
	.then(d => console.log(JSON.stringify(d, null, 2)));
	