

const express = require('express')
const app = express()
const path = require('path');
//const i18n = new I18n()
const router = require('./routes/routes.js') 
const config = require('./config/config.js')
const mongoose = require('mongoose');
const db = mongoose.connection;
const session = require('express-session')
const flash = require('express-flash');
const passport = require('passport');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon')
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var connectedUsers = []

app.use(session({
  secret: config.session_secret,
  resave: false,
  saveUninitialized: true
}))
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/socket.io-client/dist'));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

//rutas
app.use(router);


mongoose.connect( config.db_connect, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Database successfull connection!!');
    http.listen(config.port, () => {
        console.log(`ChatLearning app listening at http://localhost:${config.port}`)
    })
});


io.on('connection', (socket) => {
  socket.on('user_join', function(msg){
    connectedUsers[msg.username] = socket;
    //connectedUsers['aaa'].emit('private','private message');
    //socket.broadcast.emit('message','public message');
  });
  socket.on('private',function(msg){
    if(msg.type == 'invitation'){
      connectedUsers[msg.receiver].emit('private',{
        type:msg.type,
        sender: msg.sender,
        receiver:msg.receiver,
        text:msg.text,
        port:config.port
      })
    }else if( msg.type == 'invitation_accepted'){
      connectedUsers[msg.receiver].emit('private',{
        type:msg.type,
        text: msg.text,
      })
    }else if( msg.type == 'invitation_rejected'){
      connectedUsers[msg.receiver].emit('private',{
        type:msg.type,
        text: msg.text,
      })
    }
    
  });
  socket.on('on_lobby',function(data){
    socket.join(data.game_id);
    io.to(data.game_id).emit('lobby_connected');
  });
  socket.on('user_ready',function(data){
    io.to(data.game_id).emit('user_ready', data);
  });
  socket.on('user_loged',function(){
    io.emit('user_loged');
  });
  socket.on('user_loged_out',function(data){
    io.emit('user_loged_out',data);
  })
  socket.on('user_out_of_game',function(data){
    socket.to(data.game_id).emit('user_out_of_game',data);
  });
  socket.on('all_users_ready', function(data){
    io.to(data.game_id).emit('all_users_ready');
  });
  socket.on('chat_msg', function(data){
    socket.to(data.game_id).emit("chat_msg", data);
  });
  socket.on('question_answered', function(data){
    socket.to(data.game_id).emit("question_answered", data);
  });
  socket.on('next_question', function(data){
    socket.to(data.game_id).emit( "next_question", data );
  });
  socket.on('game_finished', function(data){
    io.to(data.game_id).emit('game_finished',data);
  });
  socket.on('update_game_answers', function(data){
    socket.to(data.game_id).emit("update_game_answers", data);
  });
});
