var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();
var cartasRt = express.Router();
var salasRt = express.Router();
var models = require('./models/carta_model')(app, mongoose);
var Controller = require('./controllers/cartas');
var CtrlSalas = require('./controllers/salas');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/truco', function(err, res) {
    if(err) throw err;
    console.log('Connected to Database');
});

/*router.get('/', function(req, res) {
   res.send("Hello World!");
});*/
  
salasRt.route('/partidas')
  .get(CtrlSalas.getPartidas);

cartasRt.route('/cartas')
  .get(Controller.findAllcartas)
  .post(Controller.addCarta);

app.use('/', cartasRt);
app.use('/', salasRt);


server.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/vista', function (req, res) {
  res.sendFile(__dirname + '/views/vista2.html');
});

app.get('/css', function (req, res) {
  res.sendFile(__dirname + '/css/styles.css');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  socket.on('log', function(data) {
    console.log(data);
    socket.emit('devuelvo', { msj2: 'llego todo piola' });
  });

  socket.on('salaNueva', function(data) {
    console.log(Controller.findAllcartas);
    CtrlSalas.createPartida(function(partida){
      socket.emit('sala', {partida: partida})
    })   
    /*CtrlSalas.getPartida(function(partida){
      socket.emit('sala', {partida: partida});
    })*/
    
  });
});

var nsp = io.of('/vista');
nsp.on('connection', function(socket){
  console.log('someone connected');
  socket.emit('msj', 'socketVista');
});
//nsp.emit('hi', 'everyone!');
