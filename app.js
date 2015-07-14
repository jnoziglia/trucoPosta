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
var models = require('./models/carta_model')(app, mongoose);
var Controller = require('./controllers/cartas');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/truco', function(err, res) {
    if(err) throw err;
    console.log('Connected to Database');
});

/*router.get('/', function(req, res) {
   res.send("Hello World!");
});*/


cartasRt.route('/cartas')
  .get(Controller.findAllcartas)
  .post(Controller.addCarta);

//app.use('/', cartasRt);


server.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
