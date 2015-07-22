//auth controller
var mongoose = require('mongoose');  
var User = mongoose.model('User');  
//var service = require('../services');

exports.emailSignup = function(req, res) {  
    var user = new User({
        //Creamos el usuario con los campos
       	username:    req.body.username,
        email:     req.body.email,
        password:     req.body.password
    });

    user.save(function(err){
        //si todo sale bien envio el token
        
        return res
            .status(200);
            //.send({token: service.createToken(user)});
    });
};

exports.emailLogin = function(req, res) { 
    // find the user
  User.findOne({
    name: req.body.username
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
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   
}
});
};