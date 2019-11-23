var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../db/db_config');

var database = db.DB;
router.post('/signup', function(req,res,next){
    console.log("Input from the user:",req.body);
    var newCustomer = {};
    newCustomer.email = req.body.email;
    newCustomer.password = req.body.password;
    newCustomer.firstname = req.body.first;
    newCustomer.lastname=req.body.last;
    newCustomer.ssn = req.body.ssn;
    newCustomer.address = req.body.address;
    newCustomer.creditcardno = req.body.credit;
    var con = mysql.createConnection(database);
    con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to DB!");
    var sql = "INSERT INTO customer SET ?";
    con.query(sql,newCustomer,function(err,result){
      if (err) throw err;
      else {
        console.log("New Customer Data inserted successfully");
        res.render("user_home");
    }
    })
})
})

module.exports = router;
