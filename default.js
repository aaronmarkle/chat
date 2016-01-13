var socket = io();

var currentRoom = 'main';
socket.emit('join room', currentRoom);

function chatroomLinks(btnId, roomName) {
  document.getElementById(btnId).addEventListener('click', function(){
    socket.emit('leave room', currentRoom);
    socket.emit('join room', roomName);
    currentRoom = roomName;
    document.getElementById('title').textContent = roomName + ' chat';
  });
}
chatroomLinks('main-link', 'main');
chatroomLinks('dev-link', 'dev');
chatroomLinks('sports-link', 'sports');
chatroomLinks('games-link', 'games');

document.getElementById('user-submit').addEventListener('click', function(e){
  e.preventDefault();
  socket.emit('adduser', document.getElementById('user').value);
  document.getElementById('user-form').classList.add('hidden');
  var form = document.getElementById('form');
  var usernameNode = document.createTextNode(document.getElementById('user').value);
  form.insertBefore(usernameNode, form.firstChild)
});

document.getElementById('send').addEventListener('click', function(e){
  e.preventDefault();
  message = document.getElementById('m').value;
  socket.emit('send', {room: currentRoom, message: message});
  document.getElementById('form').reset();
});

socket.on('message', function(username, msg){
  var node = document.createTextNode(username + ': ' + msg);
  var li = document.createElement('li');
  li.appendChild(node);
  document.getElementById('messages').appendChild(li);
});