var bcrypt = require('bcryptjs');
var MongoClient = require('mongodb').MongoClient
var MongoServer = require('mongodb').Server;
var Db = require('mongodb').Db;
var maindb = require('../service/DBService');
var assert = require('assert');
module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            maindb(function (db) {
                db.collection('users').insert(newUser, function (err, data) {
                    assert.equal(err, null);
                    if (!err)
                        console.log('user created', data);
                    callback(data.ops);
                });
            });
        });
    });
}
module.exports.getUserByUsername = function (username, callback) {
    var query = {username: username};
    //User.findOne(query, callback);
}

module.exports.getUserById = function (id, callback) {
    //User.findById(id, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        console.log(candidatePassword, hash);
        if (err)
            throw err;
        callback(null, isMatch);
    });
}
