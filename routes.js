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

	//auth
	app.get('/auth/signup', function (req, res) {
	  res.sendFile(__dirname + '/views/auth/signup.html');
	});
	app.get('/auth/login', function (req, res) {
	  res.sendFile(__dirname + '/views/auth/login.html');
	});

}	
