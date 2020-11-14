const User = require('../models/user')

login = (req,res) =>{
    let messages = { 'error':req.flash('error') };
    res.render('login/login.twig', messages);
}


module.exports = { login }