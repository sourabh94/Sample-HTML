var express = require('express');
var router = express.Router();
var async = require('async');
var maindb = require('../service/DBService.js');
//var maindb = require('../service/CRUD.js');
var ObjectID = require('mongodb').ObjectID;
var UserDb;
global.UserDb;
global.UserDbName;
global.branch;
global.branchName;
global.sessionId;
var BranchDb;
var assert = require('assert');
var randomstring = require("randomstring");
var jwt = require('jsonwebtoken');
var smtpTransport = require('nodemailer-smtp-transport');
var nodemailer = require('nodemailer');
var jwtSecret = 'kjwdjs65$ikksop0982shj';
var transporter = nodemailer.createTransport(smtpTransport({
    service: 'Gmail',
    auth: {user: 'debabrat.das@stu.utm.ac.in',
        pass: 'archana18tulgm'}
}));
/* GET home page. */
router.get('/', function (req, res) {
    res.sendFile("../public/index.html");
});
router.get('/eventlist', function (req, res) {
    maindb(function (db) {
        db.collection('event').find().toArray(function (err, data) {
            res.send(data);
        });
    });
});
router.get('/event/:name', function (req, res) {
    console.log();
    maindb(function (db) {
        db.collection('event').findOne({event: req.params.name}, function (err, data) {
            res.send(data);
        });
    });
});
router.post('/addQuery', function (req, res) {
    console.log(req.body);
    transporter.sendMail({
        from: 'debabrat das <debabrat.das@stu.utm.ac.in>',
        to: 'sourabh.vijaypatil@stu.utm.ac.in',
        subject: req.body.subject,
        text: req.body
    }, function (error, response) {
        console.log(error, response);
    });
    maindb(function (db) {
        db.collection('query').save(req.body).then(function (data) {
            res.send(data);
        });
    });

});
router.get('/query/:id', function (req, res) {
    var id = new ObjectID(req.params.id);
    maindb(function (db) {
        db.collection('query').findOne({_id: id}, function (err, data) {
            res.send(data);
        });
    });
});
module.exports = router;
