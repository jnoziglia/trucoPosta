var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
var fs = require('fs');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var md5 = require('md5');
var session = require('client-sessions');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
  cookieName: 'session',
  secret: 'super_secret',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.set('view engine', 'ejs');

var router = express.Router();
var partidasRt = express.Router();
var rtGral = express.Router();


//CONTROLLERS
var CtrlRoutes = require('./routes');
CtrlRoutes.app = app;

var users = {};
var userSockets;
var clients = {};

app.get('/login', function(req, res) {
  res.render('pages/login.ejs');
});

app.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) {
      res.render('pages/login.ejs', { error: 'Invalid email or password.' });
    } else {
      if (req.body.password === user.password) {
        // sets a cookie with the user's info
        req.session.user = user;
        res.redirect('/dashboard');
      } else {
        res.render('pages/login.ejs', { error: 'Invalid email or password.' });
      }
    }
  });
});

app.post('/guest', function(req, res) {
  var user = {};
  user.username = req.body.username;
  // sets a cookie with the user's info
  users[user.username] = user;
  req.session.user = user;
  res.redirect('/dashboard');
});

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    if (users[req.session.user.username]) {
      var user = users[req.session.user.username];
      req.user = user;
      req.session.user = user;  //refresh the session value
      res.locals.user = user;
    }
    // finishing processing the middleware and run the route
    next();
  } else {
    next();
  }
});


router.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/partidas.html');
});


rtGral.get('/css', function (req, res) {
  res.sendFile(__dirname + '/css/styles.css');
});


rtGral.get('/main', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


app.get('/dashboard', requireLogin, function(req, res) {
  res.render('dashboard.ejs');
});




//carpeta public para las imagenes
app.use(express.static('public'));
app.use('/partidas', partidasRt);
app.use('/partida', partidasRt);
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


});


function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
};



function validateUser(username, md5) {
  if (users[username].md5 == md5){
    return true;
  }
  else {
    return false;
  }
}