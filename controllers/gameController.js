const mongoose = require('mongoose');
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

getConnectedUsers = async function(req,res){
    var fields = {connected: true, username:{ $ne:req.user.username}};
    if(req.query.searched) 
        fields.username = new RegExp('.*'+req.query.searched+'.*', "i");

    await User.find(fields)
        .then(users => {
            var html = printConnectedUsers(users);
                res.send({
                    status:'ok',
                    html:html
                });
        }).catch(err => {
            res.send({status:'ko',message:'No se han podido obtener los usuarios conectados'});
        });
} 

deteUserFromGame = async function(req,res){
    //borra del array de jugadores al salir
    await Game.findByIdAndUpdate(
        { _id: req.body.game_id, },
        { $pull: { users: { user: req.user._id } } },
        { new: true }
    ).then(async game =>{
        //borrar el juego si se queda sin jugadoes
        if(game.users.length == 0){
            await Game.deleteOne({
                _id:req.body.game_id
            }).then(result => res.send(result))
            .catch(err => res.send(err) );
        }
    })
    .catch(err => res.send(err));
}

updateUserState = async function(req,res){
    await Game.findOneAndUpdate(
        {_id: req.body.game_id},
        {$set: {"users.$[el].ready": true } },
        { 
          arrayFilters: [{ "el.user": req.user.id }],
          new: true
        }
    ).then( await function(data){
        Game.findById(req.body.game_id)
        .then( game => {
            var all_users_ready = checkIfAllReady ( game.users);
            res.send({
                all_users_ready:all_users_ready
            });
        })
        .catch(err => console.log(err));
    })
    .catch(err => res.send())
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
        var state = user.user.state?'Preparado':'No está preparado';
        html += `<span class="row test-item" id="player-item-${user.user.username}">
                    <div class="col-sm-8">${user.user.username}</div>
                    <div class="col-sm-4 state">${state}</div>
                </span>`;
    });

    return html;
} 

printConnectedUsers = function(users){
    var html = ``;
    users.forEach(function(user){
        html += `<span class="row test-item" id="user-item-${user.username}">
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

checkIfAllReady = function(users){
    var all_ready = true;

    users.forEach(function(user){
        if( !user.ready)
            all_ready = user.ready;
    })

    return all_ready;
}


module.exports = { createLobby,lobby, getConnectedPlayers, getConnectedUsers, deteUserFromGame, updateUserState }
