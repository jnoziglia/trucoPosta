//rutas

module.exports = function(app,io){
	app.get('/', function (req, res) {
	  res.sendFile(__dirname + '/views/index.html');
	});

	app.get('/vista', function (req, res) {
	  res.sendFile(__dirname + '/views/vista2.html');
	});

	app.get('/css', function (req, res) {
	  res.sendFile(__dirname + '/css/styles.css');
	});

}	
