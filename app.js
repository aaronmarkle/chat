var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var urlParser = bodyParser.urlencoded({ extended: false });

// Mongoose configuration
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String
});
var User = mongoose.model('User', userSchema);

var chatSchema = new Schema({
  created: Date,
  content: String,
  username: String,
  room: String
});
var Chat = mongoose.model('Chat', chatSchema);

// Passport login configuration
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
passport.use('local-login', new LocalStrategy(function(username, password, done) {
  User.findOne({username: username}, function(err, user){
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
}));

passport.use('local-signup', new LocalStrategy({passReqToCallback: true}, function(req, username, password, done) {
  User.findOne({'username': username}, function(err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, false, { message: 'Username is already taken.'});
    } else {
      var newUser = new User();
      newUser.username = username;
      newUser.password = password;
      newUser.save(function(err) {
        if (err) {
          throw err;
        }
        return done(null, newUser);
      });
    }
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(require('express-session')({
  secret: 'super secret session key',
  resave: false,
  saveUninitialized: true
}));

var theInitializer = passport.initialize();
app.use(theInitializer);
app.use(passport.session());

// Socket configuration
io.on('connection', function(socket){
  socket.on('adduser', function(username) {
    socket.username = username;
  });

  socket.on('join room', function(room) {
    socket.room = room;
    socket.join(room);
    var roomList = Object.keys(io.sockets.adapter.rooms[room].sockets);
    var userList = [];
    for (var i=0; i<roomList.length; i++) {
      userList.push(io.sockets.connected[roomList[i]].username);
    }
    Chat.find({'room': socket.room}).exec(function(err, msgs) {
      chatHistory = msgs;
      socket.emit('loadHistory', chatHistory);
    });
    io.sockets.in(room).emit('updateRoom', socket.username, userList);
  });

  socket.on('leaveRoom', function(room) {
    socket.leave(socket.room);
    if (io.sockets.adapter.rooms[room]) {
      var roomList = Object.keys(io.sockets.adapter.rooms[room].sockets);
      var userList = [];
      for (var i=0; i<roomList.length; i++) {
        userList.push(io.sockets.connected[roomList[i]].username);
      }
      io.sockets.in(room).emit('updateList', socket.username, userList);
    }
  });

  socket.on('switchRoom', function(newroom) {
    if (newroom !== socket.room) {
      socket.room = newroom;
      socket.join(newroom);
      var roomList = Object.keys(io.sockets.adapter.rooms[newroom].sockets);
      var userList = [];
      for (var i=0; i<roomList.length; i++) {
        userList.push(io.sockets.connected[roomList[i]].username);
      }
      Chat.find({'room': socket.room}).exec(function(err, msgs) {
        chatHistory = msgs;
        socket.emit('loadHistory', chatHistory);
      });
      io.sockets.in(newroom).emit('updateRoom', socket.username, userList);
    }
  });

  socket.on('send', function(data) {
    io.sockets.in(data.room).emit('message', socket.username, data.message);
    var newChat = new Chat({
      created: new Date(),
      content: data.message,
      username: socket.username,
      room: data.room
    });
    newChat.save(function(err) {
      if (err) throw err;
    });
  });
});

// Routes
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

app.get('/signup', function(req, res) {
  res.sendFile(__dirname + '/signup.html');
});

app.get('/chat', function(req, res) {
  if (req.user) {
    res.sendFile(__dirname + '/chat.html');
  } else {
    res.redirect('/');
  }
});

app.get('/userinfo', function(req, res) {
  if (req.user) {
    res.json(req.user);
  } else {
    res.end();
  }
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.post('/', urlParser, passport.authenticate('local-login', {successRedirect: '/chat', failureRedirect: '/'}));

app.post('/signup', urlParser, passport.authenticate('local-signup', {successRedirect: '/chat', failureRedirect: '/signup'}));

http.listen(8080, function(){
  console.log('server live on port 8080');
});