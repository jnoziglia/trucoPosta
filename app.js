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
var partidasRt = express.Router();
var models = require('./models/carta_model')(app, mongoose);
var models = require('./models/partida_model')(app, mongoose);
var Controller = require('./controllers/cartas');
var CtrlPartidas = require('./controllers/partidas');

//importo las rutas
require('./routes')(app, io); 

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/truco', function(err, res) {
    if(err) throw err;
    console.log('Connected to Database');
});

//NOTA MENTAL: esto deberia ir en las rutas???  
partidasRt.route('/partidas')
  .get(CtrlPartidas.findAllPartidas)
  .post(CtrlPartidas.addPartida);

partidasRt.route('/partidas/:id')
  .get(CtrlPartidas.findById)
  .delete(CtrlPartidas.deletePartida);

partidasRt.route('/maxPartida')
  .get(CtrlPartidas.findMax);
  
cartasRt.route('/cartas')
  .get(Controller.findAllcartas)
  .post(Controller.addCarta);

app.use('/', cartasRt);
app.use('/', partidasRt);


server.listen(8000, function() {
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
