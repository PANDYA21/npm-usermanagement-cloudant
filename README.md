# NPM module for usermanagement with IBM Cloudant
This repository serves as a module for basic usermanagement with cloudant database.

## Pre-requisites
- Cloudant service instance (on cloud or local)
- A Database created ion the service instance dedicated for usermangement (default name: `users`)

## Usage
Install module:
```bash
npm install git+https://github.com/PANDYA21/npm-usermanagement-cloudant.git --save
```

Require in your code:
```javascript
const Usermanagement = require('usermanagement-cloduant');

// for cloudant accounts locally or on cloud
let usermanagement = new Usermanagement({
	account: 'cloudant_account', 
	password: 'cloudant_password'
});

// for cloudant accounts on cloud-foundary
let usermanagement = new Usermanagement({
	username: 'cloudant_username', 
	password: 'cloudant_password',
	url: 'cloudant_url',
	host: 'cloudant_host',
	port: 'cloudant_port'
});

// for cloudant accounts on cloud-foundary with connected apps-services via VCAP_SERVICES env var, the creds will be fetched automatically.
let usermanagement = new Usermanagement({ db_name: 'myCloudant' });
// the parameter 'db_name' is required to fetch the named cloudant instance from VCAP_SERVICES.


// create a user
usermanagement.createUser({ username: abc@domain.de, password: 'abcDEF@123' })
	.catch(console.error)
	.then(d => console.log(JSON.stringify(d, null, 2)));
```

## API ref
### createUser
```javascript
usermanagement.createUser({ username: 'abc@domain.de', password: 'abcDEF@123' })
	.catch(console.error)
	.then(d => console.log(JSON.stringify(d, null, 2)));
```

### getUser
```javascript
await usermanagement.getUser('abc@domain.de') // returns a Promise
```

### updateUser
```javascript
await usermanagement.updateUser({ username: abc@domain.de, password: 'newPassword', role: 'newRole' }) // returns a Promise
```

### setUserActive
```javascript
await usermanagement.setUserActive('abc@domain.de') // returns a Promise
```

### setUserInactive
```javascript
await usermanagement.setUserInactive('abc@domain.de') // returns a Promise
```

### deleteUser
```javascript
await usermanagement.deleteUser('abc@domain.de') // returns a Promise
```

### authenticateUser
```javascript
await usermanagement.authenticateUser({ username: 'abc@domain.de', password: 'passwordToBeVarified' }) // returns a Promise
```

### getAllUsers
```javascript
await usermanagement.getAllUsers() // returns a Promise
```

### getActiveUsers
```javascript
await usermanagement.getActiveUsers() // returns a Promise
```

### createIndexForActiveKey
```javascript
await usermanagement.createIndexForActiveKey() // returns a Promise
```
