var socket = io();
var currentRoom = 'main';

var userInfoRequest = new XMLHttpRequest();
userInfoRequest.onload = function() {
  var userInfo = JSON.parse(userInfoRequest.responseText);
  document.getElementById('username').textContent = userInfo.username;
  socket.emit('adduser', userInfo.username);
  socket.emit('join room', currentRoom);
}
userInfoRequest.open('GET', '/userinfo');
userInfoRequest.send();

function chatroomLinks(btnId, roomName) {
  document.getElementById(btnId).addEventListener('click', function(){
    if (roomName !== currentRoom) {
      socket.emit('leaveRoom', currentRoom);
    }
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

socket.on('loadHistory', function(chatHistory) {
  while (document.getElementById('messages').firstChild) {
    document.getElementById('messages').removeChild(document.getElementById('messages').firstChild);
  }
  for (var i=chatHistory.length-1; i>=0; i--) {
    var node = document.createTextNode(chatHistory[i].username + ': ' + chatHistory[i].content);
    var li = document.createElement('li');
    li.appendChild(node);
    document.getElementById('messages').appendChild(li);
  }
});

socket.on('updateRoom', function(username, userList) {
  var node = document.createTextNode(username + ' has joined the ' + currentRoom + ' chat');
  var li = document.createElement('li');
  li.appendChild(node);
  document.getElementById('messages').appendChild(li);
  while (document.getElementById('users-list').firstChild) {
    document.getElementById('users-list').removeChild(document.getElementById('users-list').firstChild);
  }
  for (i=0; i<userList.length; i++) {
    var node = document.createTextNode(userList[i]);
    var li = document.createElement('li');
    li.appendChild(node);
    document.getElementById('users-list').appendChild(li);
  }
});

socket.on('updateList', function(username, userList) {
  var node = document.createTextNode(username + ' has left the ' + currentRoom + ' chat');
  var li = document.createElement('li');
  li.appendChild(node);
  document.getElementById('messages').appendChild(li);
  while (document.getElementById('users-list').firstChild) {
    document.getElementById('users-list').removeChild(document.getElementById('users-list').firstChild);
  }
  for (i=0; i<userList.length; i++) {
    var node = document.createTextNode(userList[i]);
    var li = document.createElement('li');
    li.appendChild(node);
    document.getElementById('users-list').appendChild(li);
  }
})