var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('dev message', function(msg){
    io.emit('dev message', msg);
  });
  socket.on('sports message', function(msg){
    io.emit('sports message', msg);
  });
  socket.on('games message', function(msg){
    io.emit('games message', msg);
  });
});

http.listen(8080, function(){
  console.log('server live on port 8080');
});