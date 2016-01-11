var socket = io();

var currentRoom = 'main';

document.getElementById('main-link').addEventListener('click', function(){
  document.getElementById(currentRoom).classList.add('hidden');
  document.getElementById('main').classList.remove('hidden');
  currentRoom = 'main';
});

document.getElementById('dev-link').addEventListener('click', function(){
  document.getElementById(currentRoom).classList.add('hidden');
  document.getElementById('dev').classList.remove('hidden');
  currentRoom = 'dev';
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
});

document.getElementById('send').addEventListener('click', function(e){
  e.preventDefault();
  socket.emit('chat message', document.getElementById('m').value);
  document.getElementById('form').reset();
});

document.getElementById('dev-send').addEventListener('click', function(e){
  e.preventDefault();
  socket.emit('dev message', document.getElementById('dev-m').value);
  document.getElementById('dev-form').reset();
});

document.getElementById('sports-send').addEventListener('click', function(e){
  e.preventDefault();
  socket.emit('sports message', document.getElementById('sports-m').value);
  document.getElementById('sports-form').reset();
});

document.getElementById('games-send').addEventListener('click', function(e){
  e.preventDefault();
  socket.emit('games message', document.getElementById('games-m').value);
  document.getElementById('games-form').reset();
});

socket.on('chat message', function(msg){
  var li = document.createElement('li');
  var node = document.createTextNode(msg);
  li.appendChild(node);
  document.getElementById('messages').appendChild(li);
});

socket.on('dev message', function(msg){
  var li = document.createElement('li');
  var node = document.createTextNode(msg);
  li.appendChild(node);
  document.getElementById('dev-messages').appendChild(li);
});

socket.on('sports message', function(msg){
  var li = document.createElement('li');
  var node = document.createTextNode(msg);
  li.appendChild(node);
  document.getElementById('sports-messages').appendChild(li);
});

socket.on('games message', function(msg){
  var li = document.createElement('li');
  var node = document.createTextNode(msg);
  li.appendChild(node);
  document.getElementById('games-messages').appendChild(li);
});