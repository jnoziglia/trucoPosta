var contador = 0;
var partidas = new Array(1,2,3);

exports.getPartidas = function(req, res) {
	res.status(200).send(partidas);
}

exports.createPartida = function(callback){
	contador++;
	callback(contador);
}