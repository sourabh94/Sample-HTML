var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
//the MongoDB connection
var connectionInstance;
module.exports = function (callback) {
    //if already we have a connection, don't connect to database again
    if (connectionInstance) {
        callback(connectionInstance);
        return;
    }
    var db = new Db('tripstr', new Server("127.0.0.1", '27017', {auto_reconnect: true}));
    db.open(function (error, db) {
           if (error)
            throw new Error(error);
        connectionInstance = db;
        callback(db);
    });
};