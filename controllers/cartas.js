//File: controllers/cartas.js
var mongoose = require('mongoose');
var Carta  = mongoose.model('carta');

//GET - Return all cartas in the DB
exports.findAllcartas = function(req, res) {
    Carta.find(function(err, cartas) {
    if(err) res.send(500, err.message);

    console.log('GET /cartas')
        res.status(200).jsonp(cartas);
    });
};

//POST - Insert a new TVShow in the DB
exports.addCarta = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var carta = new Carta({
        nombre:    req.body.nombre,
        valor:     req.body.valor
    });

    carta.save(function(err, carta) {
        if(err) return res.send(500, err.message);
    res.status(200).jsonp(carta);
    });
};