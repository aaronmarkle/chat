var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var urlParser = bodyParser.urlencoded({ extended: false });

// Mongodb configuration
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/users';

// Passport login configuration
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  function(username, password, done) {
    MongoClient.connect(url, function(err, db) {
      var users = db.collection('users');
      users.findOne({username: username}, function(err, user){
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (password === user.password) {
          return done(null, username);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
}));

var theInitializer = passport.initialize();
app.use(theInitializer);

// Socket configuration
io.on('connection', function(socket){
  socket.on('adduser', function(username){
    socket.username = username;
  });

  socket.on('join room', function(room) {
    console.log('joining room', room);
    socket.join(room);
  });
  
  socket.on('leave room', function(room) {
    console.log('leaving room', room);
    socket.leave(room);
  });

  socket.on('send', function(data) {
    io.sockets.in(data.room).emit('message', socket.username, data.message);
  });
});

// Routes
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', urlParser, passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', session: false}));

http.listen(8080, function(){
  console.log('server live on port 8080');
});