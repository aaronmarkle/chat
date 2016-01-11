var socket = io();
document.getElementById('send').addEventListener('click', function(e){
  e.preventDefault();
  socket.emit('chat message', document.getElementById('m').value);
  document.getElementById('form').reset();
});
socket.on('chat message', function(msg){
  var li = document.createElement('li');
  var node = document.createTextNode(msg);
  li.appendChild(node);
  document.getElementById('messages').appendChild(li);
});