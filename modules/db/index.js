const util = require('util');
const MongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');
const _ = require('lodash');

const User = require('../user');


async function _connect(url_or_client, dbname, should_connection_be_left_open = false) {
  const localclient = typeof url_or_client === 'string' ? new MongoClient(url_or_client, { useNewUrlParser: true }) : url_or_client;
  return new Promise(function (resolve, reject) {
    localclient.connect(err => {
      if (err) {
        return reject(err);
      }
      if (!should_connection_be_left_open) {
        console.log('closing the con');
        localclient.close();
      }
      resolve(localclient);
    });
  });
}


class DB {
  constructor() {
    if (arguments.length === 0) {
      throw new Error('Missing required parameters to auth against mongodb');
    }
    for (let arg in arguments[0]) {
      this[arg] = arguments[0][arg];
    }
    this.keepAlive = arguments[0].keepAlive == undefined ? false : arguments[0].keepAlive;
    this.dbname = this.dbname || 'users';
    this.collectionname = this.collectionname || 'users';
    console.log(this);
  }

  async connect(keepAlive = false) {
    const keepItAlive = this.keepAlive || keepAlive;
    this.client = await _connect(this.uri, this.dbname, keepItAlive);
    return this;
  }

  getDb() {
    this.db = this.client.db(this.dbname);
    // return this;
  }

  async getCollection() {
    this.collection = await this.db.collection(this.collectionname);
    // return this;
  }

  async setDbColIfNot() {
    if (this.collection == undefined) {
      console.debug('creating a new connection... ');
      await this.connect(true);
      await this.getDb();
      await this.getCollection();
    }
  }

  async ensureUniqueId() {
    await this.setDbColIfNot();
    console.debug('Ensuring unique index for username...');
    await this.db.createIndex('users', { username: 1 }, { unique: true, dropDups:true } );
    console.debug('closing connection that was used for ensureIndex...');
    if (!this.keepAlive) {
      this.client.close();
      this.db.s.topology.close();
      this.collection.s.db.s.topology.close();
    }
  }

  async _find() {
    await this.setDbColIfNot();
    const response = await this.collection
      .find(this.query, this.queryOptions)
      .sort(this.sortingOptions)
      .toArray();
    if (!this.keepAlive)
      this.collection.s.db.s.topology.close();
    return response; // { response, connection: this };
  }

  async _insert() {
    await this.setDbColIfNot();
    const response = await this.collection.insertMany(this.insertDocuments);
    if (!this.keepAlive)
      this.collection.s.db.s.topology.close();
    return response; // { response, connection: this };
  }

  async _update() {
    await this.setDbColIfNot();
    const response = await this.collection.updateMany(this.updateFilter, this.updateDocument);
    if (!this.keepAlive)
      this.collection.s.db.s.topology.close();
    return { 
      message: 'Modified ' + response.result.nModified + '; with status==ok: ' + (response.result.ok == 1),
      response, 
      connection: this
    };
  }

  async get(username) {
    this.query = { username };
    return await this._find();
  }

  async insert(user) {
    this.insertDocuments = [ user ];
    try {
      return await this._insert();
    } catch(e) {
      console.log('closing mongo con');
      this.client.close();
      throw e;
    }
  }

}


async function getEm3() {
  const user = new User({ username: 'abc5@domain.com', password: 'def' });
  const db = new DB({
    uri: 'mongodb://localhost:27017',
    keepAlive: true
  });
  await db.ensureUniqueId();
  const insertResponse = await db.insert(user);
  const gotUser = await db.get(user.username);
  db.db.s.topology.close();
  return gotUser;
}

// const log = require('why-is-node-running');

getEm3()
  .then(x => {
    console.log(x);
  })
  .catch(x => {
    console.error(x);
    // log();
  });



// setTimeout(() => {
//   process.exit(0);
// }, 5000);

