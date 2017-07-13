var express = require('express');
var maindb = require('../service/DBService.js');
var User = require('../service/user.js');
var jwt = require('jsonwebtoken');
var ObjectID = require('mongodb').ObjectID;
var jwtSecret = 'kjwdjs65$ikksop0982shj';
var assert = require('assert');
var multer = require('multer');
var router = express.Router();

router.post('/login', function (req, res) {
    var master;
    var username = req.body.username;
    var password = req.body.password;
    maindb(function (db) {
                login(db, username, password, function(data){
                	res.send(data);
                });
    });
});
router.post('/checkUsr',function(req,res){
    maindb(function (db) {
        db.collection('users').find().toArray(function (err,data) {
            if(data===null||data.length===0)
            {    
                defaultUser(function(err,data){
                    res.send('wow');
                });
            }else
            res.send('wow');
            
        });
    });
});
router.get('/querylist',function(req,res){
	maindb(function (db) {
        db.collection('query').find().toArray(function (err,data) {
            res.send(data);
        });
    });
});

router.get('/query/:id',function(req,res){
    var id = new ObjectID(req.params.id);
    maindb(function (db) {
        db.collection('query').findOne({_id:id},function (err,data) {
            res.send(data);
        });
    });
});
var login = function (database, username, password, callback) {
    var db = database;
    db.collection('users').findOne({username: username}, function (err, user) {
        assert.equal(err, null);
        if (!user)
            callback({message: 'Unknown User'});
        else {
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err)
                    throw err;
                if (isMatch) {
                    var token = jwt.sign({username: username}, jwtSecret);
                    callback({token: token, user: user});
                    //res.send({data:user});
                } else {
                    callback({message: 'Invalid password'});
                }
            });
        }
    });
};
var defaultUser = function(callback){
        var newUser = {
            name: 'admin',
            username: 'admin',
            password: 'Daddy@007',
            type: 'admin'
        };
        User.createUser(newUser, function (err, user) {
            callback(err, user);
        });
    
};
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
      cb(null, './public/img/events/');
     },
    filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
     }
});
var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

var addEvent = function(event,img){
	var data = {
		event:event.event,
		description:event.description,
		imgname:img
	};
	maindb(function (db) {
        db.collection('event').save(data).then(function (data) {
            console.log(data);
        });
    });
};
router.post('/upload', function(req, res) {
        upload(req,res,function(err){
			addEvent(req.body,req.file.filename);
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            else
             res.json({error_code:0,err_desc:null});
        });
});
router.post('/remove',function(req,res){
    maindb(function (db) {
        db.collection('event', function(err, collection) {
            collection.deleteOne({_id: new ObjectID(req.body.id)});
        });
    });
});
module.exports = router;
