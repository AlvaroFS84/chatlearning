const Game = require('../models/game');
const Test = require('../models/test');
const User = require('../models/user');

createLobby = async function(req,res){
    var test_id = req.params.test_id;
    var test = await Test.findById(test_id);
    var newGame = Game();
    newGame.test = test;
    newGame.users.push({
        user: req.user,
        calification: 0
    });
    await newGame.save();
    res.redirect('/game/'+ newGame._id);
}

lobby = async function(req,res){
    var game_id = req.params.game_id;
    var game =  await Game.findById(game_id).populate('test').populate('users.user');
    var exists = await alreadyInGame(req.user._id, game_id, game.users); 
    if( !exists){
        game.users.push({
            user: req.user,
            calification: 0
        });
        await game.save();
    }
    var connected_players_html = printPlayers(game.users);

    res.render('game/game.twig', { 
        username: req.user.username,
        game_id: game._id,
        test_title: game.test.title,
        connected_players_html:connected_players_html
    });
}

getConnectedPlayers = function(req,res){
    var game_id = req.query.game_id;
    Game.findById(game_id).populate('users.user').exec(function(err, game){
        if(err){
            res.send({status:'ko',message:'No se han podido obtener los jugadores conectados'});
        }else{
            var html = printPlayers(game.users);

            res.send({
                status:'ok',
                html:html
            });
        }
        
    })  
} 

getConnectedUsers = function(req,res){
    var fields = {connected: true, username:{ $ne:req.user.username}};
    if(req.query.searched) 
        fields.username = new RegExp('.*'+req.query.searched+'.*', "i");

    User.find(fields).exec(function(err, users){
        if(err){
            res.send({status:'ko',message:'No se han podido obtener los usuarios conectados'});
        }else{
            var html = printConnectedUsers(users);
            res.send({
                status:'ok',
                html:html
            });
        }
    })  
} 

//comprueba si el usuario ya esta en el juego
alreadyInGame = async function(user_id, game_id) {
    var result = await Game.findById(game_id).find({ 
        users: { 
           $elemMatch: { user: user_id } 
        }
    }); 
    
    return result.length != 0;
}

printPlayers = function(users){
    var html = ``;
    users.forEach(function(user){
        html += `<span class="row test-item" id="player-item-${user.user.username}">
                    <div class="col-sm-8">${user.user.username}</div>
                </span>`;
    });

    return html;
} 

printConnectedUsers = function(users){
    var html = ``;
    users.forEach(function(user){
        html += `<span class="row test-item">
                    <div class="col-sm-8">${user.username}</div>
                    <div class="col-sm-4">
                        <button onclick="send_invitation('${user.username}')" class="test-item-button btn base-btn rounded-input">
                            Invitar
                        </button>
                    </div>
                </span>`;
    });

    return html;
}

module.exports = { createLobby,lobby, getConnectedPlayers, getConnectedUsers }
