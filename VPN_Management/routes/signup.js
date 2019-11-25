var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../db/db_config');

var database = db.DB;
router.post('/signup', function (req, res, next) {

  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth();
  var day = d.getDate();
  var c = new Date(year + 1, month, day)
  var plan = {};
  plan.license_no = Math.floor(100000 + Math.random() * 900000);
  plan.membership_id =  Math.floor(100000 + Math.random() * 900000);
  plan.start_date = d;
  plan.end_date = c;

  var newCustomer = {};
  var cardInfo = {};
  newCustomer.email = req.body.email;
  newCustomer.full_name = req.body.fullname;
  newCustomer.ssn = req.body.ssn;
  newCustomer.address = req.body.address;
  newCustomer.membership_id = plan.membership_id;
  newCustomer.card_info = req.body.credit;
  var date = req.body.year + "-" + req.body.month + "-11";
  var parts = date.split('-');
  // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
  // January - 0, February - 1, etc.
  var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
  cardInfo.expiration_date = mydate;
  cardInfo.card_no = req.body.credit;




  console.log("Input from the user:", req.body);


  console.log("Input for the plan:", plan);
  console.log("Input from the cardInfo", cardInfo);
  var con3 = mysql.createConnection(database);
  var con2 = mysql.createConnection(database);
  var con = mysql.createConnection(database);

  con3.connect(function (err) {
    if (err) throw err;
    console.log("Connected to DB!");
    var sql = "INSERT INTO USER SET ?";
    var sql2 = "INSERT INTO CARD_INFO SET ?";
    var sql3 = "INSERT INTO PLAN SET ?";
    con3.query(sql3, plan, function (err, result) {
      if (err) throw err;

      else {
        console.log("New PLAN Data inserted successfully");
        con.connect(function (err) {
          if (err) throw err;
          console.log("Connected to DB!");

          con.query(sql, newCustomer, function (err, result) {
            console.log(sql);
            if (err) throw err;
            else {
              console.log("New user Data inserted successfully");
              con2.connect(function (err) {
                con2.query(sql2, cardInfo, function (err, result) {
                  console.log("New Card Info Data inserted successfully");
                  var client ={};
                  client.name =  newCustomer.full_name
                  client.email=  newCustomer.email;
                  client.image="images/"+newCustomer.full_name+".jpg";
                  client.id=  newCustomer.membership_id;
                  console.log(client);
                  req.session.user = client;
                  res.render("user_home",{
                    name: client.fullname,
                    image: client.image,
                    email:req.session.user.email
                  });
                });
              });
            }
          })
        });
      }
      });
  })
})

module.exports = router;
