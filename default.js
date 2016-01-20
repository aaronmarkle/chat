var socket = io();

var userInfoRequest = new XMLHttpRequest();
userInfoRequest.onload = function() {
  var userInfo = JSON.parse(userInfoRequest.responseText);
  document.getElementById('username').textContent = userInfo.username;
  socket.emit('adduser', userInfo.username);
}
userInfoRequest.open('GET', '/userinfo');
userInfoRequest.send();

var currentRoom = 'main';
socket.emit('join room', currentRoom);

function chatroomLinks(btnId, roomName) {
  document.getElementById(btnId).addEventListener('click', function(){
    socket.emit('switchRoom', roomName);
    currentRoom = roomName;
    document.getElementById('title').textContent = roomName + ' chat';
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

socket.on('message', function(username, msg) {
  var node = document.createTextNode(username + ': ' + msg);
  var li = document.createElement('li');
  li.appendChild(node);
  document.getElementById('messages').appendChild(li);
});

socket.on('updateRoom', function(username) {
  var node = document.createTextNode(username + ' has joined the ' + currentRoom + ' chat');
  var li = document.createElement('li');
  li.appendChild(node);
  document.getElementById('messages').appendChild(li);
});