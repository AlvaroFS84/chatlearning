const User = require('../models/user')

class ProfileController{
    
    showProfile = function(req,res){
        
        /*var user =  User.findOne({
            email:req.user.email
        });
        console.log(user);*/
        res.render('register/register.twig');
    }
}

module.exports = new ProfileController()