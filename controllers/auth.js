//auth controller
var mongoose = require('mongoose');  
var User = mongoose.model('User');  
var service = require('../services');

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
            .status(200)
            .send({token: service.createToken(user)});
    });
};

exports.emailLogin = function(req, res) { 
    User.findOne({email: req.body.email.toLowerCase(),}, function(err, user) {

        // Comprobar si hay errores
        // Si el usuario existe o no
        //TO DO: Y si la contraseña es correcta
        //TO DO:guardar el token en session storage 
      
        return res
            .status(200)
            .send({token: service.createToken(user)});
    });
};