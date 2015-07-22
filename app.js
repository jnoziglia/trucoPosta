var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');

var server = require('http').Server(app);
var io = require('socket.io')(server);
var jwt = require('jsonwebtoken');
var config = require('./config');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();
var cartasRt = express.Router();
var partidasRt = express.Router();
//user routes
var userRt = express.Router();

//CONFIG

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
app.set('tokenultrasecreto', config.secret); // secret variable



//MODELS
var models = require('./models/carta_model')(app, mongoose);
var models = require('./models/partida_model')(app, mongoose);
var models = require('./models/user_model')(app, mongoose);

//CONTROLLERS
var Controller = require('./controllers/cartas');
var CtrlPartidas = require('./controllers/partidas');
var CtrlAuth = require('./controllers/auth');
//var middleware = require('./middleware');


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/truco', function(err, res) {
    if(err) throw err;
    console.log('Connected to Database');
});

//auth
  userRt.get('/signup', function (req, res) {
    res.sendFile(__dirname + '/views/auth/signup.html');
  });
  userRt.get('/login', function (req, res) {
    res.sendFile(__dirname + '/views/auth/login.html');
  });

//NOTA MENTAL: esto deberia ir en las rutas???
//API  USERS
userRt.route('/signup')
  .post(CtrlAuth.emailSignup);

userRt.route('/login')
  .post(CtrlAuth.emailLogin);

//importo las rutas
//require('./routes')(app, io); 

// route middleware to verify a token
partidasRt.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
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

// route middleware to verify a token
cartasRt.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
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

// route middleware to verify a token
  router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
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


partidasRt.route('/')
  .get(CtrlPartidas.findAllPartidas)
  .post(CtrlPartidas.addPartida);

partidasRt.route('/:id')
  .get(CtrlPartidas.findById)
  .delete(CtrlPartidas.deletePartida);

/*partidasRt.route('/maxPartida')
  .get(CtrlPartidas.findMax);*/
  
cartasRt.route('/')
  .get(Controller.findAllcartas)
  .post(Controller.addCarta);

router.get('/home', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

router.get('/vista', function (req, res) {
  res.sendFile(__dirname + '/views/vista2.html');
});

router.get('/css', function (req, res) {
  res.sendFile(__dirname + '/css/styles.css');
});

app.use('/cartas', cartasRt);
app.use('/partidas', partidasRt);
app.use('/auth', userRt);
app.use('/home', router);



server.listen(8080, function() {
  console.log("Node server running on http://localhost:8000");
});


io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

socket.on('partidaCreada', function(data) {
  console.log(data);
  socket.broadcast.emit('recargar');
});

  socket.on('partidaNueva', function(data) {
    console.log(Controller.findAllcartas);
    CtrlPartidas.createPartida(function(partida){
      socket.emit('partida', {partida: partida})
    })   
    /*CtrlPartidas.getPartida(function(partida){
      socket.emit('partida', {partida: partida});
    })*/
  });
/*socket.on('disconnect', function(data) {
    console.log('user disconnected');
    socket.broadcast.emit('disconnected');
  });*/

});

var nsp = io.of('/vista');
nsp.on('connection', function(socket){
  console.log('someone connected');
  socket.emit('msj', 'socketVista');

});
//nsp.emit('hi', 'everyone!');
