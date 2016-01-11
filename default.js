var socket = io();
document.getElementById('send').addEventListener('click', function(){
  socket.emit('chat message', document.getElementById('m').value);
});