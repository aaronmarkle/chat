var socket = io();

var currentRoom = 'main';
socket.emit('join room', currentRoom);

function chatroomLinks(btnId, roomName) {
  document.getElementById(btnId).addEventListener('click', function(){
    socket.emit('leave room', currentRoom);
    socket.emit('join room', roomName);
    currentRoom = roomName;
  });
}
chatroomLinks('main-link', 'main');
chatroomLinks('dev-link', 'dev');
chatroomLinks('sports-link', 'sports');
chatroomLinks('games-link', 'games');

document.getElementById('send').addEventListener('click', function(e){
  e.preventDefault();
  message = document.getElementById('m').value;
  socket.emit('send', {room: currentRoom, message: message});
  document.getElementById('form').reset();
});

socket.on('message', function(msg){
  var node = document.createTextNode(msg);
  var li = document.createElement('li');
  li.appendChild(node);
  document.getElementById('messages').appendChild(li);
});