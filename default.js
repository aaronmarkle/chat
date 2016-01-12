var socket = io();

var currentRoom = 'main';

function chatroomLinks(btnId, divId) {
  document.getElementById(btnId).addEventListener('click', function(){
    document.getElementById(currentRoom).classList.add('hidden');
    currentRoom = divId;
    document.getElementById(currentRoom).classList.remove('hidden');
  });
}
chatroomLinks('main-link', 'main');
chatroomLinks('dev-link', 'dev');
chatroomLinks('sports-link', 'sports');
chatroomLinks('games-link', 'games');

/* buttonListener takes care of adding the event listeners to chatroom buttons

document.getElementById('main-link').addEventListener('click', function(){
  document.getElementById(currentRoom).classList.add('hidden');
  currentRoom = 'main';
  document.getElementById(currentRoom).classList.remove('hidden');
});

document.getElementById('dev-link').addEventListener('click', function(){
  document.getElementById(currentRoom).classList.add('hidden');
  currentRoom = 'dev';
  document.getElementById(currentRoom).classList.remove('hidden');
});

document.getElementById('sports-link').addEventListener('click', function(){
  document.getElementById(currentRoom).classList.add('hidden');
  document.getElementById('sports').classList.remove('hidden');
  currentRoom = 'sports';
});

document.getElementById('games-link').addEventListener('click', function(){
  document.getElementById(currentRoom).classList.add('hidden');
  document.getElementById('games').classList.remove('hidden');
  currentRoom = 'games';
});*/
function sendMessageListener(roomSendBtn) {
  document.getElementById(roomSendBtn).addEventListener('click', function(e){
    e.preventDefault();
    socket.emit(currentRoom + '-message', document.getElementById(currentRoom + '-m').value);
    document.getElementById(currentRoom + '-form').reset();
  });
}
sendMessageListener('main-send');
sendMessageListener('dev-send');
sendMessageListener('sports-send');
sendMessageListener('games-send');

/* sendMessageListener replaces this code
  document.getElementById('main-send').addEventListener('click', function(e){
  e.preventDefault();
  socket.emit(currentRoom + '-message', document.getElementById(currentRoom + '-m').value);
  document.getElementById(currentRoom + '-form').reset();
});

document.getElementById('dev-send').addEventListener('click', function(e){
  e.preventDefault();
  socket.emit('dev-message', document.getElementById('dev-m').value);
  document.getElementById('dev-form').reset();
});

document.getElementById('sports-send').addEventListener('click', function(e){
  e.preventDefault();
  socket.emit('sports-message', document.getElementById('sports-m').value);
  document.getElementById('sports-form').reset();
});

document.getElementById('games-send').addEventListener('click', function(e){
  e.preventDefault();
  socket.emit('games-message', document.getElementById('games-m').value);
  document.getElementById('games-form').reset();
});*/

socket.on('main-message', function(msg){
  var li = document.createElement('li');
  var node = document.createTextNode(msg);
  li.appendChild(node);
  document.getElementById('main-messages').appendChild(li);
});

socket.on('dev-message', function(msg){
  var li = document.createElement('li');
  var node = document.createTextNode(msg);
  li.appendChild(node);
  document.getElementById('dev-messages').appendChild(li);
});

socket.on('sports-message', function(msg){
  var li = document.createElement('li');
  var node = document.createTextNode(msg);
  li.appendChild(node);
  document.getElementById('sports-messages').appendChild(li);
});

socket.on('games-message', function(msg){
  var li = document.createElement('li');
  var node = document.createTextNode(msg);
  li.appendChild(node);
  document.getElementById('games-messages').appendChild(li);
});