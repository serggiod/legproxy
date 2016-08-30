var express = require('express');
var request = require('request');
var String  = require('string');
var app = express();

app.set('port', (process.env.PORT || 5000));

// Devuelve una respuesta vacía para la petición a la raíz. 
app.all('/', function(Rq,Rs) {
	Rs.append('Status','404 Not Found');
	Rs.append('Conection','close');
	Rs.status(404);
	Rs.send('');
});

// Devuelve las primeras fotografias de un usuario de Flickr. 
app.get('/flickr/:uri',function(Rq,Rs){
	uri = ('https://')+(Rq.params.uri.split('.-.').join('/'));
	if(Rq.params.uri.length>=1 && uri.substring(0,22)==='https://www.flickr.com'){
		request(uri,function(Err,Res,Bdy){
			if(!Err && Res.statusCode===200){
				html = String(Bdy);
				ini  = html.indexOf('view photo-list-view requiredToShowOnServer photostream') +486;
				end  = html.indexOf('view pagination-view requiredToShowOnServer photostream');
				sub  = html.substring(ini,end).s;
				console.log(sub);

				regexpi = new RegExp(/(url)(.)+(\"\ d)/gi);
				json  = sub.match(regexpi);
				for(i in json){
					json[i] = json[i]
						.replace('url(','https:')
						.replace(')" d','');
				}

				Rs.header('Access-Control-Allow-Origin','*');
				Rs.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
				Rs.header('Content-Type','application/json');
				Rs.send(json);
			}
		});
	}
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


