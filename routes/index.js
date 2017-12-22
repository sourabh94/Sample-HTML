var express = require('express');
var router = express.Router();
//var async = require('async');
//var maindb = require('../service/DBService.js');
//var maindb = require('../service/CRUD.js');
//var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var randomstring = require("randomstring");
var jwt = require('jsonwebtoken');
var fs = require('fs');
//var smtpTransport = require('nodemailer-smtp-transport');
//var nodemailer = require('nodemailer');
var jwtSecret = 'kjwdjs65$ikksop0982shj';
// var transporter = nodemailer.createTransport(smtpTransport({
//     service: 'Gmail',
//     auth: {user: 'debabrat.das@stu.utm.ac.in',
//         pass: 'archana18tulgm'}
// }));
/* GET home page. */
router.get('/', function (req, res) {
    res.sendFile("../public/index.html");
});

router.get('/google1db5d98c04cba720', function (req, res) {
    res.sendFile("../public/google1db5d98c04cba720.html");
});

router.get('/products', function (req, res) {
var obj;
// Read the file and send to the callback
fs.readFile("./routes/products.json", handleFile)

// Write the callback function
function handleFile(err, data) {
    if (err) throw err
    obj = JSON.parse(data)
    res.send(obj);
}
});

module.exports = router;
