//File: controllers/partidas.js
var mongoose = require('mongoose');
var Partida  = mongoose.model('partida');

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

    var query = Partida.findOne({}) // 'this' now refers to the Member class
    .sort('-numero');
    query.exec(function (err, num) {
	  if (err) return handleError(err);

	    var partida = new Partida({
	        fecha:    req.body.fecha,
	        player1:     req.body.player1,
	        player2:     req.body.player2,
	        numero: 	num.numero+1
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
   
        res.status(200).jsonp(partida);
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