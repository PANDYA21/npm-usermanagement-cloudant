module.exports = {
	db: {
		// dummy nosql like database object
		get: function (params, callback) { return callback(null, 'Will process "db.get" on your db object.'); },
		create: function (params, callback) { return callback(null, 'Will process "db.create" on your db object.'); },
		get: function (params, callback) { return callback(null, 'Will process "db.get" on your db object.'); },
		destroy: function (params, callback) { return callback(null, 'Will process "db.destroy" on your db object.'); },
		list: function (params, callback) { return callback(null, 'Will process "db.list" on your db object.'); },
		use: function (params, callback) { return callback(null, 'Will process "db.use" on your db object.'); },
		scope: function (params, callback) { return callback(null, 'Will process "db.scope" on your db object.'); },
		compact: function (params, callback) { return callback(null, 'Will process "db.compact" on your db object.'); },
		replicate: function (params, callback) { return callback(null, 'Will process "db.replicate" on your db object.'); },
		changes: function (params, callback) { return callback(null, 'Will process "db.changes" on your db object.'); },
		follow: function (params, callback) { return callback(null, 'Will process "db.follow" on your db object.'); },
		followUpdates: function (params, callback) { return callback(null, 'Will process "db.followUpdates" on your db object.'); },
		updates: function (params, callback) { return callback(null, 'Will process "db.updates" on your db object.'); },
	}
}
