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
              con2.end();
              con.end();
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
    var sql = "select c.device_name, c.private_IP_Address, c.device_ID from CUSTOMER_DEVICE c JOIN DEVICE_OWNER d ON c.device_id = d.device_id where d.membership_id=" + req.session.user.id+";SELECT * FROM CONNECT;";
    var info = {
      "data": []
    };

    con.query(sql, function (err, result) {
      if (err) throw err;
      else {
        // info.data = result[0];
        var connectedDevices=[];

        for(var j=0; j<result[1].length; j++){
        connectedDevices.push(result[1][j].device_ID);  
        }
        for(var i=0; i<result[0].length; i++){
          
          var object={};
            object.device_name=result[0][i].device_name;
          object.device_ID=result[0][i].device_ID;
                object.private_IP_Address=result[0][i].private_IP_Address;
              if(connectedDevices.includes(result[0][i].device_ID)){  
                object.isConnected=true;
              }
          else{
            object.isConnected=false;
          }
          info.data.push(object);
        }
        res.send(info);
        con.end();
      }
    });
  });
});

router.post('/connect-switch', function (req, res, next) {
  console.log(req.body, "my name is priyanshi");

  var device = {};
  
  device.device_ID = req.body.device_ID;


  var con = mysql.createConnection(database);
  var con1 = mysql.createConnection(database);
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to DB!");
    var sql = "SELECT * FROM VPN_SERVER_SWITCH LIMIT 1 ;";
    var sql1 = "INSERT INTO CONNECT SET ?";

    con.query(sql, function (err, result) {
      if (err) throw err;

      else {
        var switch_obj={};
        switch_obj.switch_ID=result[0].switch_ID;
        switch_obj.device_ID=req.body.device_ID;
        console.log(switch_obj);
        con1.connect(function (err) {
          if (err) throw err;
          console.log("Connected to DB!");

          con1.query(sql1, switch_obj, function (err, result) {
            if (err) throw err;

            else {
              console.log("New CONNECT Data inserted successfully");


              res.redirect("home");
              con1.end();
              con.end();
            }
          })
        })
      }
    })
  })
});

router.delete('/disconnect-switch', function (req, res, next) {
  console.log(req.body);
  var con = mysql.createConnection(database);
  con.connect(function (err) {
    if (err) throw err;
    console.log(req.query);
    console.log(database);
    var sql = "DELETE FROM CONNECT WHERE device_ID='"+ req.body.device_ID + "';";
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

router.get('/list-admin', function (req, res, next) {
  var con = mysql.createConnection(database);
  con.connect(function (err) {
    if (err) throw err;
    console.log(req.query);
    console.log(database);
    //var sql = "select A.device_ID, switch_ID from CONNECT A join DEVICE_OWNER B on A.device_ID = B.device_ID join USER C on C.ssn = B.ssn where C.ssn=" + req.session.user.ssn.toString();
    var sql = "select * from REGULAR_EMPLOYEE";
    //console.log(sql);
      var info = {
      "data": []
    };
    //console.log(sql)
    con.query(sql, function (err, result) {
      //console.log(result);
      if (err) {throw err;}
      else {
        //console.log(result);
        info.data = result;
        res.send(info);
        con.end();
      }
    });
  });
});

router.get('/admin-server', function (req, res, next) {
  var con = mysql.createConnection(database);
  con.connect(function (err) {
    if (err) throw err;
    //console.log(req.query);
    //console.log(database);
    //var sql = "select A.device_ID, switch_ID from CONNECT A join DEVICE_OWNER B on A.device_ID = B.device_ID join USER C on C.ssn = B.ssn where C.ssn=" + req.session.user.ssn.toString();
    var sql = "select * from VPN_SERVER";
    //console.log(sql);
      var info = {
      "data": []
    };
    //console.log(sql)
    con.query(sql, function (err, result) {
      //console.log(result);
      if (err) {throw err;}
      else {
        //console.log(result);
        info.data = result;
        res.send(info);
        con.end();
      }
    });
  });
});

router.get('/admin-con-device', function (req, res, next) {
  var con = mysql.createConnection(database);
  con.connect(function (err) {
    if (err) throw err;
    console.log(req.query);
    console.log(database);
    var sql = "SELECT full_name, private_IP_Address, device_name from CONNECT JOIN CUSTOMER_DEVICE JOIN DEVICE_OWNER JOIN USER WHERE CONNECT.device_ID = CUSTOMER_DEVICE.device_ID AND CONNECT.device_ID = DEVICE_OWNER.device_ID AND USER.ssn = DEVICE_OWNER.ssn";
    console.log(sql);
      var info = {
      "data": []
    };
    console.log(sql)
    con.query(sql, function (err, result) {
      console.log(result);
      if (err) {throw err;}
      else {
        console.log(result);
        info.data = result;
        res.send(info);
        con.end();
      }
    });
  });
});

router.get('/admin-members', function (req, res, next) {
  var con = mysql.createConnection(database);
  con.connect(function (err) {
    if (err) throw err;
    //console.log(req.query);
    //console.log(database);
    var sql = "select USER.full_name as full_name, USER.membership_ID as membership_ID, USER.email as email,  PLAN.license_no as license_no, PLAN.start_date as start_date, PLAN.end_date as end_date from USER join PLAN ON USER.membership_ID = PLAN.membership_id";
    //console.log(sql);
      var info = {
      "data": []
    };
    //console.log(sql)
    con.query(sql, function (err, result) {
      //console.log(result);
      if (err) {throw err;}
      else {
        //console.log(result);
        info.data = result;
        res.send(info);
        con.end();
      }
    });
  });
});


module.exports = router;
