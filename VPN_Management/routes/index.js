var express = require('express');
var router = express.Router();
var db = require('../db/db_config');
var mysql = require('mysql');


var database = db.DB;

/* GET Login */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'VPN Management System' });
});

router.get('/login', function(req, res, next) {
  res.render('index', { title: 'VPN Management System' });
});

/* GET Sign up */
router.get('/signup', function(req, res, next) {

  res.render('signup', { title: 'VPN Management System' });
});


router.get('/home', function(req, res, next) {
  if (req.session && req.session.user) {
  res.render('user_home', { name: req.session.user.name,
  email:req.session.user.email,
  image:req.session.user.image,
  });
} else {
  res.render('index', { title: 'VPN Management System' });
}

});

router.get('/plans', function(req, res, next) {
  if (req.session && req.session.user) {
  res.render('manage_lease', { name: req.session.user.name,
    email:req.session.user.email,
    image:req.session.user.image,
   });
  } else {
    res.render('index', { title: 'VPN Management System' });
  }
});


  router.get('/verify', function(req,res, next) {
    console.log("here");
    var con = mysql.createConnection(database);
    con.connect(function(err) {
      if (err) throw err;
      console.log(req.query);
      console.log(database);
      var sql = "Select * from customer;";
      con.query(sql,function(err,result){
        if (err) throw err;
        else {
            for(var i= 0; i<result.length; i++){
                //console.log(req.query.username);
                if(result[i].email==req.query.email && result[i].password==req.query.password){
                  var client ={};
                  client.name = result[i].firstname;
                  client.fullname = result[i].firstname +" " + result[i].lastname;
                  client.email=result[i].email;
                  client.image="images/"+result[i].firstname+".jpg";
                  console.log(client);
                  req.session.user = client;
               return res.send("success");
                } 
            }
            return res.send("Password/Username is incorrect. Please Try again.");
        }
      })
    });
  });
module.exports = router;
