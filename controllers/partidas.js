//File: controllers/partidas.js
var mongoose = require('mongoose');
var Partida  = mongoose.model('partida');
var md5 = require('md5');

var partidas = {};

//GET - Return all partidas in the DB
exports.findAllPartidas = function(req, res) {
    Partida.find(function(err, partidas) {
    if(err) res.send(500, err.message);

    console.log('GET /partidas')
        res.status(200).jsonp(partidas);
    });
};

//POST - Insert a new TVShow in the DB
exports.addPartida = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var cartas = [
            '1_basto',
            '2_basto',
            '3_basto',
            '4_basto',
            '5_basto',
            '6_basto',
            '7_basto',
            '10_basto',
            '11_basto',
            '12_basto',
            '1_espada',
            '2_espada',
            '3_espada',
            '4_espada',
            '5_espada',
            '6_espada',
            '7_espada',
            '10_espada',
            '11_espada',
            '12_espada',
            '1_copa',
            '2_copa',
            '3_copa',
            '4_copa',
            '5_copa',
            '6_copa',
            '7_copa',
            '10_copa',
            '11_copa',
            '12_copa',
            '1_oro',
            '2_oro',
            '3_oro',
            '4_oro',
            '5_oro',
            '6_oro',
            '7_oro',
            '10_oro',
            '11_oro',
            '12_oro'
    ];
       
    var arr = []
    for (var i = 0; i < 6; i++) {
         var randomnumber=Math.ceil(Math.random()*39);
          var found=false;
          for(var j=0; j<arr.length;j++){
            if(arr[j]==randomnumber){found=true;break}
          }
          if(!found)arr[arr.length]=randomnumber;
    };
    var cartasPosta = arr.map(function(num) {
      return cartas[num];
    }); 




    var query = Partida.findOne({}) // 'this' now refers to the Member class
    .sort('-numero');
    query.exec(function (err, num) {
	  if (err) return handleError(err);

	    var partida = new Partida({
	        fecha:    req.body.fecha,
	        player1:     req.body.player1,
	        player2:     req.body.player2,
	        numero: 	num.numero+1,
            cartas1: [cartasPosta[0],cartasPosta[1],cartasPosta[2]],
            cartas2: [cartasPosta[3],cartasPosta[4],cartasPosta[5]]
	    });

	    partida.save(function(err, partida) {
	        if(err) return res.send(500, err.message);
	    res.status(200).jsonp(partida);
	    });
	});
};

/*exports.findMax = function(req, res) {
  
	 res.status(200).send(partida);
	})
    
};*/

exports.findById = function(req, res) {
    Partida.findById(req.params.id, function(err, partida) {
    if(err) return res.send(500, err.message);

    console.log('GET /partida/' + req.params.id);
         res.setHeader('Content-Type', 'application/json');
        // res.status(200).jsonp(partida);
         res.send(partida);
              console.log('partida: '+partida);
    });
};

exports.deletePartida = function(req, res) {
    Partida.findById(req.params.id, function(err, partida) {
        partida.remove(function(err) {
            if(err) return res.send(500, err.message);
      res.status(200);
        });
    });
};

/* -------------------------------------------------------------- */

module.exports = {
    nuevaPartida: function(username) {
        var partida = md5(username + (Math.floor(Math.random() * 100)+1)  + partidas.length);
        
        partidas[partida] = {};
        partidas[partida].jugador1 = username;
        partidas[partida].jugador2 = "";
        partidas[partida].numero = Object.keys(partidas).length;
        console.log(partidas);
        return partidas[partida];
    },

    traerPartidas: function(req, res) {
        res.json(partidas);
    },

    traerPartida: function(req, res) {
        res.json(partidas[req.params.id]);
    }
};