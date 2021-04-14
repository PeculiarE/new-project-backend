'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('users_2', {
    columns: {
      id: {
        type: 'uuid',
        defaultValue: new String('gen_random_uuid()'),
        primaryKey: true
      },
      first_name: {
        type: 'string',
        notNull: true
      },
      last_name: {
        type: 'string',
        notNull: true
      },
      email: {
        type: 'string',
        notNull: true,
        unique: true
      },
      country: {
        type: 'string',
        notNull: true
      },
      dob: {
        type: 'string',
        notNull: true
      },
      username: {
        type: 'string',
        notNull: true,
        unique: true
      },
      password_hash: {
        type: 'string',
        notNull: true
      },
      password_reset_token: {
        type: 'string',
        notNull: false
      },
      created_at: {
        type: 'timestamp',
        defaultValue: new String('now()')
      },
      updated_at: {
        type: 'timestamp',
        defaultValue: new String('now()')
      },
    },
    ifNotExists: true
  }, function(err) {
    if (err) return callback(err);
    return callback();
  });
};

exports.down = function(db, callback) {
  db.dropTable('users_2', callback);
};

exports._meta = {
  "version": 1
};
