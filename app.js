var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

io.on('connection', function(socket){
  socket.on('join room', function(room) {
    console.log('joining room', room);
    socket.join(room);
  });
  
  socket.on('leave room', function(room) {
    console.log('leaving room', room);
    socket.leave(room);
  });

  socket.on('send', function(data) {
    io.sockets.in(data.room).emit('message', data.message);
  });
});

http.listen(8080, function(){
  console.log('server live on port 8080');
});