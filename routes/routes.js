const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
const profileController = require('../controllers/profileController');
const mainPageController = require('../controllers/mainPageController');
const testController = require('../controllers/testController');
const questionController = require('../controllers/testController');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const isAuthenticated = require('../middleware/isAuthenticated');
require('../passport/passport_config');



router.get('/', isAuthenticated, mainPageController.showMainPage);
router.get('/logout',mainPageController.logout);

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

router.get('/perfil',isAuthenticated, profileController.showProfile);
router.post('/save-test', testController.saveTest);
router.get('/crear-test', isAuthenticated, testController.createTest);

module.exports = router