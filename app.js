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
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  MongoClient.connect(url, function(err, db) {
    var users = db.collection('users');
    users.findOne({username: id}, function(err, user) {
      done(err, user);
    });
  });
});

app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

var theInitializer = passport.initialize();
app.use(theInitializer);
app.use(passport.session());

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
//app.use(express.static(__dirname));
app.get('/default.css', function(req, res) {
  res.sendFile(__dirname + '/default.css');
});

app.get('/default.js', function(req, res) {
  res.sendFile(__dirname + '/default.js');
});

app.get('/', function(req, res) {
  if (req.user) {
    res.redirect('/chat');
  } else {
    res.sendFile(__dirname + '/login.html');
  }
});

app.get('/chat', function(req, res) {
  if (req.user) {
    res.sendFile(__dirname + '/chat.html');
  } else {
    console.log(req.user);
    res.redirect('/');
  }
});

app.post('/', urlParser, passport.authenticate('local', {successRedirect: '/chat', failureRedirect: '/'}));

http.listen(8080, function(){
  console.log('server live on port 8080');
});