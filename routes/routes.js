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
const gameController = require('../controllers/gameController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthenticatedAjax = require('../middleware/isAuthenticatedAjax');
require('../passport/passport_config');



router.get('/', isAuthenticated, mainPageController.showMainPage);
router.get('/logout',mainPageController.logout);

router.get('/login', loginController.login);
/*router.post('/login',
    passport.authenticate( 
        'local-signin', 
        { 
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
            badRequestMessage:'El usuario o contraseña utilizados no son correctos'
        }
    )
);*/
router.post('/login', function(req, res, next) {
    passport.authenticate('local-signin', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { 
            req.flash('error','El usuario o contraseña utilizados no son correctos');
            return res.redirect('/login'); 
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
        req.flash('login', true);
        
        return res.redirect('/');
      });
    })(req, res, next);
  });
router.get('/registro', registerController.register);
router.post('/registro', registerController.registerUser);

router.get('/google-signin',
  passport.authenticate('google', 
    { scope:[ 'email', 'profile' ]}
));

router.get( '/google-callback',
    passport.authenticate( 'google', {failureRedirect: '/login'}),
    function(req,res){
        res.redirect('/');
    }
);

router.get('/perfil',isAuthenticated, profileController.showProfile);
router.post('/guardar-test', testController.saveTest);
router.get('/crear-test', isAuthenticated, testController.createTest);
router.get('/jugar/:test_id',isAuthenticated, gameController.createLobby);
router.get('/game/:game_id',isAuthenticated, gameController.lobby);
router.get('/getPlayers', isAuthenticatedAjax, gameController.getConnectedPlayers);
router.get('/getConnectedUsers',isAuthenticatedAjax, gameController.getConnectedUsers);
router.post('/update_profile', isAuthenticated, profileController.updateProfile)

//ajax
router.get('/search-test', isAuthenticated, mainPageController.searchTest);
router.post('/delete_user_from_game', isAuthenticatedAjax, gameController.deteUserFromGame);
router.post('/update_user_state', isAuthenticatedAjax, gameController.updateUserState);
router.post('/update_game_state', isAuthenticatedAjax, gameController.updateGameState);
router.get('/get_game_state', isAuthenticatedAjax, gameController.getGameState);
router.get('/get_username', isAuthenticatedAjax, registerController.getUserName);
router.post('/calculate_result', isAuthenticatedAjax, gameController.calculateGameResult);


module.exports = router