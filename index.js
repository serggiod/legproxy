var express = require('express');
var request = require('request');
var String  = require('string');
var base64  = require('base-64');
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
	uri = base64.decode(Rq.params.uri);
	if(Rq.params.uri.length>=1 && uri.substring(0,22)==='https://www.flickr.com'){
		request(uri,function(Err,Res,Bdy){
			if(!Err && Res.statusCode===200){
				html = String(Bdy);
				ini  = html.indexOf('view photo-list-view requiredToShowOnServer photostream') +486;
				end  = html.indexOf('view pagination-view requiredToShowOnServer photostream');
				sub  = html.substring(ini,end).s;

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

// Devuelve los ultimos videos de un usuario de youtube.
app.get('/youtube/:uri',function(Rq,Rs){
	uri = base64.decode(Rq.params.uri);
	console.log(uri);
	if(Rq.params.uri.length>=1 && uri.substring(0,23)==='https://www.youtube.com'){
		request(uri,function(Err,Res,Bdy){
			if(!Err && Res.statusCode===200){
				html = String(Bdy).s;
				regexpi = new RegExp(/(i.ytimg.com\/vi)(.)+(\"\ aria)/gi);
				imgs = Bdy.match(regexpi);
				json = {};
				for(i in imgs){
					end = imgs[i].indexOf('"');
					img = 'https://'+imgs[i].substring(0,end);
					end = imgs[i].indexOf('/hqdefault');
					url = 'https://www.youtube.com/watch?v='+imgs[i].substring(15,end);
					json[i] = {
						'img':img,
						'url':url
					};
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
  console.log('Node esta corriendo en el puerto', app.get('port'));
});