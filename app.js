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
var CtrlPartidas = require('./controllers/partidas');
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
        var file = fs.readFileSync(__dirname + '/views/partidas.html', 'utf8');
      }
      else {
        socket.emit('user_conflict');
        var file = fs.readFileSync(__dirname + '/views/login.html', 'utf8');
      }
    }
    socket.emit('file', {file: file});
  });

  socket.on('new_user', function (data) {
    var username = data.username;
    user = username;
    if(!users[username]) {
      var info = {};
      //var md5 = md5(username+'token');
      info.md5 = md5(username+'token');
      info.socket = socket.id;
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

  socket.on('disconnect', function() {
    console.log(user);
    users[user].socket = 0;
    delete clients[socket.id];
    //user
    setTimeout(function(){ 
      if(users[user].socket == 0) {
        delete users[user]; 
      }
    }, 30000);
  });

});

var nsp = io.of('/vista');
nsp.on('connection', function(socket){
  console.log('someone connected');
  socket.emit('msj', 'socketVista');

});
//nsp.emit('hi', 'everyone!');
