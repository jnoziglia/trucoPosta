//auth controller
var mongoose = require('mongoose');  
var User = mongoose.model('User');  
var jwt = require('jsonwebtoken');

var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');
var config = require('../config');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
app.set('tokenultrasecreto', config.secret); // secret variable


//var service = require('../services');

exports.emailSignup = function(req, res) {  
  console.log(req.body);
    var user = new User({
        //Creamos el usuario con los campos
       	username:    req.body.username,
        email:     req.body.email,
        password:     req.body.password
    });

    user.save(function(err, user){
        //si todo sale bien envio el token
        if(err) return res.send(500, err.message);
        return res.status(200).jsonp(user);
        //.send({token: service.createToken(user)});
    });
};

exports.emailLogin = function(req, res) { 
    // find the user
    console.log(req.body.username);
    User.findOne({
    username: req.body.username
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('tokenultrasecreto'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          user: User
        });
      }   
}
});
};