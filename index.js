var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.append('HTTP/1.1','404 Not Found');
	response.append('HTTP/1.1:','404 Not Found');
	response.append('Status','404 Not Found');
	response.append('Conection','close');
	response.send('');
});

app.get('/test',function(Rq,Rs){
	Rs.header("Access-Control-Allow-Origin", "*");
  	Rs.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	Rs.send('Chequea el manual para implementar esta API.');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


