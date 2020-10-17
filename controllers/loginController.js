const User = require('../models/user')

class LoginController{

    login = (req,res) =>{
        let messages = { 'error':req.flash('error') };
        res.render('login/login.twig', messages);
    }
}

module.exports = new LoginController