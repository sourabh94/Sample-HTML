module.exports = (function () {
    var MongoServer = require('mongodb').Server;
    var Db = require('mongodb').Db;
    var maindb = require('./DBService');
    var ObjectID = require('mongodb').ObjectID;
    var assert = require('assert');
    var updateFeePay = function (id, data, dbName, collection, callback) {
        maindb(function (database) {
            var db = database.db(dbName);
            db.collection(collection).update({'_id': id}, {$set: {process: data}},
                    function (err, r) {
                        if (err)
                            console.log('Amount error is:', err);
                        assert.equal(err, null);
                        callback(r);
                    });
        });
    };
    
    return{
     };
}());