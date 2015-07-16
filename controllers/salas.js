var contador = 0;

exports.getPartida = function(callback) {
	contador++;
	callback(contador);
}