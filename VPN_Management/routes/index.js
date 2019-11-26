var express = require('express');
var router = express.Router();
var db = require('../db/db_config');
var mysql = require('mysql');


var database = db.DB;

/* GET Login */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'VPN Management System' });
});

router.get('/add', function(req, res, next) {
  if (req.session && req.session.user) {
    res.render('add_device', { name: req.session.user.name,
    email:req.session.user.email,
    image:req.session.user.image,
    ssn:req.session.user.ssn,
    id:req.session.user.id,
    });
  } else {
    res.render('index', { title: 'VPN Management System' });
  }
});


router.get('/delete', function(req, res, next) {
  if (req.session && req.session.user) {
    res.render('delete_device', { name: req.session.user.name,
    email:req.session.user.email,
    image:req.session.user.image,
    ssn:req.session.user.ssn,
    id:req.session.user.id,
    });
  } else {
    res.render('index', { title: 'VPN Management System' });
  }
});
router.get('/manage', function(req, res, next) {
  if (req.session && req.session.user) {
    res.render('manage_info', { name: req.session.user.name,
    email:req.session.user.email,
    image:req.session.user.image,
    ssn:req.session.user.ssn,
    id:req.session.user.id,
    });
  } else {
    res.render('index', { title: 'VPN Management System' });
  }
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
  ssn:req.session.user.ssn,
  id:req.session.user.id,
  });
} else {
  res.render('index', { title: 'VPN Management System' });
}

});
// Admin Home
router.get('/admin_home', function(req, res, next) {
  if (req.session && req.session.user) {
  res.render('admin_home', { name: req.session.user.name,
  email:req.session.user.email,
  image:req.session.user.image,
  ssn:req.session.user.ssn,
  id:req.session.user.id,
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
    ssn:req.session.user.ssn,
    id:req.session.user.id

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
      var sql = "Select * from  vpn_management.USER;";
      con.query(sql,function(err,result){
        if (err) throw err;
        else {
            for(var i= 0; i<result.length; i++){
              var ssn = result[i].SSN;
                ssn = ssn % 10000;
                console.log(ssn);
                if(result[i].email==req.query.email && ssn==req.query.password){
                  var client ={};
                  client.name = result[i].full_name;
                  client.email=result[i].email;
                  client.ssn = result[i].SSN;
                  client.id = result[i].membership_ID;
                  client.image="images/"+client.full_name+".jpg";
                  console.log(client);
                  req.session.user = client;
                  con.end();
               return res.send("success");

                } 
            }
            con.end();
            return res.send("Password/Username is incorrect. Please Try again.");
        }
      })
    });

  });
  router.get('/membership-info', function(req, res, next) {
    var con = mysql.createConnection(database);
    con.connect(function(err) {
      if (err) throw err;
      var sql = "SELECT * FROM PLAN p JOIN USER u ON p.membership_id= u.membership_id WHERE p.membership_id="+req.session.user.id+";";
      con.query(sql,function(err,result){
        if (err) throw err;
        else {
          
    if(result.length>0){
      var info=result[0];
      res.send(info);
      con.end();
    }
  }
})
    })


    
  });
  router.post('/membership-info', function (req, res, next) {
    console.log(req.body);
  
    var info = {};
    info.fullname=req.body.fullname;
    info.address=req.body.address;
    info.cardinfo=req.body.cardinfo;
    info.email=req.body.email;
  
    console.log(info);
  
    var con = mysql.createConnection(database);
    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected to DB!");
      var sql = "UPDATE USER SET full_name='"+info.fullname +"', address='"+ info.address+"',card_info="+info.cardinfo+",email='"+info.email+"' WHERE membership_ID="+req.session.user.id+";";
      console.log(sql);
      con.query(sql, info, function (err, result) {
        if (err) throw err;
        else{
          console.log("Successfully Updated!");
          req.session.user.name= info.fullname;
          req.session.user.email=info.email;
          res.redirect("manage");
          con.end();
        }
      })
    })

  });

  router.get('/getdevices', function (req, res, next) {
    var con = mysql.createConnection(database);
    con.connect(function (err) {
      if (err) throw err;
      var sql = "select c.device_ID, c.device_name from CUSTOMER_DEVICE c JOIN DEVICE_OWNER d ON c.device_ID = d.device_id where d.membership_id=" + req.session.user.id;
      var info = {
        "data": []
      };
      con.query(sql, function (err, result) {
        if (err) throw err;
        else {
          console.log(result);
          info.data = result;
          res.send(info);
          con.end();
        }
      });
    });

  });

  router.delete('/delete', function (req, res, next) {
    console.log(req.body);
    var con = mysql.createConnection(database);
    con.connect(function (err) {
      if (err) throw err;
      var sql = "DELETE FROM CUSTOMER_DEVICE WHERE device_ID='"+ req.body.device + "';";
      var info = {
        "data": []
      };
      con.query(sql, function (err, result) {
        if (err) {
          
          throw err;
        }
        else {
          console.log(result);
          info.data = result;
          res.send("success");
          con.end();
        }
      });
    });

  });
  


module.exports = router;
