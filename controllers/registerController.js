const User = require('../models/user');
const { updateUserState } = require('./gameController');



    /**
     * Mostrar pagina de registro
     * @param {*} req 
     * @param {*} res 
     */
    register = (req,res) => {
        res.render('register/register.twig', { 
            error: req.flash('error') ,
            success: req.flash('success'),
        });    
    }
    /**
     * Almacenar un usuario nuevo
     * @param {*} req 
     * @param {*} res 
     */
registerUser = (req,res) => {
    if(req.body.username == 0){
        req.flash('error', 'El nombre de usuario no puede estar vacío');
        return res.redirect('/registro');
    }
    if(req.body.email == 0 || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(req.body.email)){
        req.flash('error', 'El email no puede estar vacío y debe tener el formato correcto');
        return res.redirect('/registro');
    }
    if(req.body.password == 0 || req.body.password.length < 8 ){
        req.flash('error', 'La contraseña no puede estar vacía y debe tener al menos 8 caracteres');
        return res.redirect('/registro');
    }
    User.find({$or:[
        { email:req.body.email },
        { username:req.body.username }
    ]}, (err, users ) =>{
        //si hay error al buscar
        if(err){
            req.flash('error', err.message);
            res.redirect('/registro');
        }else if(users.length > 0){ //si ya exite  un usuario con el mismo nombre o email
            req.flash('error', 'El nombre de usuario o el email ya estan siendo utilizados')
            res.redirect('/registro');
        }else{ //si ha ido bien
            let newUser = User();
            newUser.email = req.body.email;
            newUser.username = req.body.username;
            newUser.password = newUser.encryptPassword(req.body.password);
            newUser.save( err =>{
                if(err) req.flash('error', 'El nombre de usuario o el email ya estan siendo utilizados')
                else req.flash('success', 'Te has registrado con éxito, ya puedes iniciar sesión');
                res.redirect('/registro');
            });
        }
        
    });
}

getUserData = function(req, res) {
    var data = {
        id: req.user._id,
        username:req.user.username,
        connected: req.user.connected,
        email: req.user.email,
        registrationDate: req.user.registrationDate
    };
    res.send(data);
}




module.exports = {register, registerUser, getUserData }