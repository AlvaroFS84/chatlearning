const { collection } = require('../models/user');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Game = require('../models/game');

    
    showProfile = async function(req,res){
        var user_games = await Game.find({
            'users':{
                $elemMatch:{
                    'user':req.user._id
                }
            },
            'state':'finished'
        }).populate('test');


        res.render('profile/profile.twig',{ 
            username: req.user.username,
            email: req.user.email,
            user_games: user_games,
            google_user: req.user.google_user,
        });
    }

    updateProfile = async function(req,res){

        var data = {};

        if(req.body.username.length > 0 )
            req.user.username = req.body.username;
        if(req.body.edit_email.length > 0 )
            req.user.email = req.body.edit_email;
        
        data.username = req.user.username;
        data.email = req.user.email;
       
        if( req.body.edit_password.length >0 && bcrypt.compareSync( req.body.edit_password,  req.user.password)){            
            req.user.password = bcrypt.hashSync( req.body.new_password, bcrypt.genSaltSync(10));
        }else if( req.body.edit_password.length >0 && !bcrypt.compareSync( req.body.edit_password,  req.user.password)){
            data.password_notice = 'No se ha modificado la contraseña actual';
        }
        try{
            await req.user.save();
            data.notice = "Los datos se han actualizado correctamente";
        }catch(err){
            var message = err.code == 11000?'El nombre de usuario o el email ya están siendo utilizados':'Se ha producido un error, vuelve a intentarlo en unos instantes';
            data.error = message;
        }
        return res.render('profile/profile.twig', data);
    }


module.exports = { showProfile, updateProfile }