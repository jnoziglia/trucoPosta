var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');
var fs = require('fs');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var md5 = require('md5');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

app.set('view engine', 'ejs');

var router = express.Router();
var cartasRt = express.Router();
var partidasRt = express.Router();
//user routes
var userRt = express.Router();
//file routes
var rtGral = express.Router();


//MODELS
var models = require('./models/carta_model')(app, mongoose);
var models = require('./models/partida_model')(app, mongoose);
var models = require('./models/user_model')(app, mongoose);

//CONTROLLERS
var Controller = require('./controllers/cartas');
var CtrlPartidas = require('./controllers/partidas.js');
var CtrlAuth = require('./controllers/auth');
var CtrlRoutes = require('./routes');
CtrlRoutes.app = app;

var users = {};
var userSockets;
var clients = {};

//CONEXION A LA BASE
/*var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/truco', function(err, res) {
    if(err) throw err;
    console.log('Connected to Database');
});*/

//auth
/*  userRt.get('/signup', function (req, res) {
    res.sendFile(__dirname + '/views/auth/signup.html');
  });
  userRt.get('/login', function (req, res) {
    res.sendFile(__dirname + '/views/auth/login.html');
  });*/

//NOTA MENTAL: esto deberia ir en las rutas???
//API  USERS
/*userRt.route('/signup')
  .post(CtrlAuth.emailSignup);

userRt.route('/login')
  .post(CtrlAuth.emailLogin);


partidasRt.route('/')
  .get(CtrlPartidas.findAllPartidas)
  .post(CtrlPartidas.addPartida);

partidasRt.route('/:id')
  .get(CtrlPartidas.findById)
  .delete(CtrlPartidas.deletePartida);
*/

/*partidasRt.route('/maxPartida')
  .get(CtrlPartidas.findMax);*/
  
/*cartasRt.route('/')
  .get(Controller.findAllcartas)
  .post(Controller.addCarta);*/

router.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/partidas.html');
});

rtGral.get('/vista', function (req, res) {
  res.sendFile(__dirname + '/views/vista2.html');
});

rtGral.get('/css', function (req, res) {
  res.sendFile(__dirname + '/css/styles.css');
});


rtGral.get('/main', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

partidasRt.use(function(req, res, next) {
  var username = req.body.username || req.query.username;
  var userHash = req.body.md5 || req.query.md5;
  if(validateUser(username, userHash)) {
    console.log('valido');
    next();
  }
  else {
    console.log('no valido');
  }
});


partidasRt.route('/')
  .post(function(req, res) {
    //if(validateUser(req.body.username, req.body.md5)) {
      var partida = CtrlPartidas.nuevaPartida(req.body.username);
      users[req.body.username].partida = partida.partida;
      var file = fs.readFileSync(__dirname + '/views/juego.html', 'utf8');
      //res.sendFile(__dirname + '/views/juego.html')
      res.json({file: file, partida: partida});
    //}
  })
  .get(CtrlPartidas.traerPartidas);

partidasRt.route('/:id')
  .get(CtrlPartidas.traerPartida);

//carpeta public para las imagenes
app.use(express.static('public'));
app.use('/cartas', cartasRt);
app.use('/partidas', partidasRt);
app.use('/partida', partidasRt);
app.use('/auth', userRt);
app.use('/home', router);
app.use('/', rtGral);



server.listen(8080, function() {
  console.log("Node server running on http://localhost:8080");
});


io.on('connection', function (socket) {
  var user;
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  socket.on('nueva_partida', function(data) {
    socket.broadcast.emit('cambio_en_partidas');
    //socket.emit('cambio_en_partidas_recibido', data);

  });

  //Usuario ingresa a la pagina
  socket.on('user_connected', function (data) {
    if (!data.user || !users[data.user]) {
      console.log('new user');
      var file = fs.readFileSync(__dirname + '/views/login.html', 'utf8');
    }
    else {
      if (users[data.user].md5 == data.md5){
        clients[socket.id] = socket;
        users[data.user].socket = socket.id;
        user = data.user;
        if (!users[user].partida) {
          var file = fs.readFileSync(__dirname + '/views/partidas.html', 'utf8');
        }
        else {
          var file = fs.readFileSync(__dirname + '/views/juego.html', 'utf8');
        }
      }
      else {
        socket.emit('user_conflict');
        var file = fs.readFileSync(__dirname + '/views/login.html', 'utf8');
      }
    }
    socket.emit('file', {file: file});
  });

  //Se registra nuevo usuario
  socket.on('new_user', function (data) {
    var username = data.username;
    user = username;
    if(!users[username]) {
      var info = {};
      //var md5 = md5(username+'token');
      info.md5 = md5(username+'token');
      info.socket = socket.id;
      info.partida = '';
      users[username] = info;
      clients[socket.id] = socket;
      this.emit('new_user_created', {username: username, md5: info.md5});
      var file = fs.readFileSync(__dirname + '/views/partidas.html', 'utf8');
      socket.emit('file', {file: file});
    }
    else {
      socket.emit('user_exists');
    }
  });

  //Usuario desconectado
  socket.on('disconnect', function() {
    if(user) {
      console.log(user);
      users[user].socket = 0;
      delete clients[socket.id];
      //user
      setTimeout(function(){ 
        if(users[user].socket == 0) {
          delete users[user]; 
        }
      }, 30000);
    }
  });

});




function validateUser(username, md5) {
  if (users[username].md5 == md5){
    return true;
  }
  else {
    return false;
  }
}