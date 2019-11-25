var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../db/db_config');
var database = db.DB;

/* Post Device Info */
router.post('/add-device', function (req, res, next) {
  console.log(req.body);

  var device = {};
  device.device_ID = "DID" + Math.floor(100000 + Math.random() * 900000);
  device.device_name = req.body.devicename;
  device.private_IP_Address = req.body.ip;
  var owner = {};
  owner.device_ID = device.device_ID;
  owner.ssn = req.session.user.ssn;
  owner.membership_id = req.session.user.id;
  console.log(device);
  console.log(owner);

  var con = mysql.createConnection(database);
  var con2 = mysql.createConnection(database);
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to DB!");
    var sql = "INSERT INTO DEVICE_OWNER SET ?";
    var sql2 = "INSERT INTO CUSTOMER_DEVICE SET ?";

    con.query(sql2, device, function (err, result) {
      if (err) throw err;

      else {
        console.log("New DEVICE_OWNER Data inserted successfully");
        con2.connect(function (err) {
          if (err) throw err;
          console.log("Connected to DB!");

          con2.query(sql, owner, function (err, result) {
            if (err) throw err;

            else {
              console.log("New CUSTOMER_DEVICE Data inserted successfully");


              res.redirect("home");
            }
          })
        })
      }
    })
  })
});


router.get('/list-devices', function (req, res, next) {
  var con = mysql.createConnection(database);
  con.connect(function (err) {
    if (err) throw err;
    console.log(req.query);
    console.log(database);
    var sql = "select device_name, private_IP_Address from CUSTOMER_DEVICE c JOIN DEVICE_OWNER d ON c.device_id = d.device_id where d.membership_id=" + req.session.user.id;
    var info = {
      "data": []
    };
    con.query(sql, function (err, result) {
      if (err) throw err;
      else {
        console.log(result);
        info.data = result;
        res.send(info);
      }
    });
  });
});




module.exports = router;
