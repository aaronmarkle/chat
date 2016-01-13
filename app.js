var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

// Mongodb configuration
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/users';

// Passport login configuration
var passport = require('passport');
var JsonStrategy = require('passport-json').Strategy;
passport.use(new JsonStrategy(function(username, password, done) {
  MongoClient.connect(url, function(err, db) {
    var collection = db.collection('users');
    collection.findOne({username: username}, function(err, user){
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

/*app.post('/login', jsonParser, function(req, res){
  console.log(req.body.username);
});*/

app.post('/login', jsonParser, passport.authenticate('json', {successRedirect: '/success', failureRedirect: '/failure', session: false}));

http.listen(8080, function(){
  console.log('server live on port 8080');
});