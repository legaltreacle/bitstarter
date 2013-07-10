var express = require('express');

var app = express.createServer(express.logger());

var fs=require('fs');
var htmlbuf=fs.readFileSync('index.html',0) //load up buffer of index.html
var htmltxt=htmlbuf.toString(0,0) //convert above to str, start @ 0th char.

app.get('/', function(request, response) {
  response.send(htmltxt);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
