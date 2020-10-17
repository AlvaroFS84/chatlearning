const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
var bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const isAuthenticated = require('../middleware/isAuthenticated');
require('../passport/passport_config');



router.get('/', isAuthenticated,(req, res) => {
    res.render('main/index.twig');
})

router.get('/login', loginController.login);
router.post('/login',
    passport.authenticate( 
        'local-signin', 
        { 
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
            badRequestMessage:'El usuario o contraseña utilizados no son correctos'
        }
    )
);
router.get('/registro', registerController.register);
router.post('/registro', registerController.registerUser);

router.get('/google-signin',
  passport.authenticate('google', 
    { scope:[ 'email', 'profile' ]}
));

router.get( '/google-callback',
    passport.authenticate( 'google', 
        {
            successRedirect: '/',
            failureRedirect: '/failure'
        }
    )
);

module.exports = router