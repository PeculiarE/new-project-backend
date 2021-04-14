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
  return db.insert('users_2', [
    'id', 'first_name', 'last_name', 'email', 'country', 'dob', 'username', 'password_hash'
  ], [
    '77bfc6fb-dca8-4063-8bd9-c03f89aad61f','Peculiar', 'Erhis', 'perhis@gmail.com', 'Nigeria', '1996-04-26', 'UniqueGal', '7613t3478ubrft78yXS'
  ], function(err) {
    if (err) return callback(err);
      return callback();
    });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
