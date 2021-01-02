const express = require('express')
const app = express()
const path = require('path');
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

//conexión mongoose
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
  /**
   * Evento al entrar en lobby
   */
  socket.on('on_lobby',function(data){
    socket.join(data.game_id);
    io.to(data.game_id).emit('lobby_connected');
  });
  /**
   * Evento usuario preparado para empezar
   */
  socket.on('user_ready',function(data){
    io.to(data.game_id).emit('user_ready', data);
  });
  /**
   * Evento usuario logado
   */
  socket.on('user_loged',function(){
    io.emit('user_loged');
  });
  /**
   * Evento usuario que cierra sesión
   */
  socket.on('user_loged_out',function(data){
    io.emit('user_loged_out',data);
  })
  /**
   * Evento lanzado cuando un ususario sale del test
   */
  socket.on('user_out_of_game',function(data){
    socket.to(data.game_id).emit('user_out_of_game',data);
  });
  /**
   * Evento todos los usuarios preparados
   */
  socket.on('all_users_ready', function(data){
    io.to(data.game_id).emit('all_users_ready');
  });
  /**
   * Evento mensaje de chat
   */
  socket.on('chat_msg', function(data){
    socket.to(data.game_id).emit("chat_msg", data);
  });
  /**
   * Evento respuesta contestada
   */
  socket.on('question_answered', function(data){
    socket.to(data.game_id).emit("question_answered", data);
  });
  /**
   * Evento próxima pregunta
   */
  socket.on('next_question', function(data){
    socket.to(data.game_id).emit( "next_question", data );
  });
  /**
   * Evento test finalizado
   */
  socket.on('game_finished', function(data){
    io.to(data.game_id).emit('game_finished',data);
  });
  /**
   * Evento actualizar respuesta durante el test
   */
  socket.on('update_game_answers', function(data){
    socket.to(data.game_id).emit("update_game_answers", data);
  });
});
