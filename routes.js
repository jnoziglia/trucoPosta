//rutas

var jwt = require('jsonwebtoken');
var app;

module.exports = function(app,io){
	



	// route middleware to verify a token
	app.use(function(req, res, next) {

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];
	
	  // decode token
	  if (token) {
	  	
	    // verifies secret and checks exp
	    jwt.verify(token, app.get('tokenultrasecreto'), function(err, decoded) {      
	      if (err) {
	        return res.json({ success: false, message: 'Failed to authenticate token.' });    
	      } else {
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;    
	        next();
	      }
	    });

	  } else {

	    // if there is no token
	    // return an error
	    return res.status(403).send({ 
	        success: false, 
	        message: 'No token provided.' 
	    });
	    
	  }
	});
	/////////////////////////////


	app.get('/home', function (req, res) {
	  res.sendFile(__dirname + '/views/index.html');
	});

	app.get('/vista', function (req, res) {
	  res.sendFile(__dirname + '/views/vista2.html');
	});

	app.get('/css', function (req, res) {
	  res.sendFile(__dirname + '/css/styles.css');
	});


}	
