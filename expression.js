var fs=require('fs'),
    path=require('path'),
    Handlebars=require('handlebars');

const WebSocket = require('ws');
 
const wss = new WebSocket.Server({ port: 8090, headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "http://localhost",
        "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS"
}  });
 
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
  	var data=JSON.parse(message);
    console.log('[RCV]',data);
  	if(typeof data.id!=='undefined'){
  		console.log('[UPDATE]',data.id,data.value);
  	}
  	wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
 
//  ws.send('');
});

var pageData = { page:{
	title: 'new templated page EVEVEVEVE'
},
	counter: 0
};


var express=require('express');

var app=express();
app.engine('ev', function (filePath, options, callback) {
				fs.readFile(filePath, function (err, content) {
								if (err)
									return callback(err);
								var template=Handlebars.compile(content.toString());
				return callback(null,template(options));
				});
})
app.use(express.static('public'));
app.set('view engine', 'ev'); // register the template engine

app.get('/',function(req,res){
		pageData.counter++;
		res.render('index',pageData);
});

app.listen(9090);

