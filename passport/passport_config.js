const passport = require('passport');
const config = require('../config/config')
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use('local-signin',new LocalStrategy({
    passReqToCallback:true
},
(req, username, password, done) => {
    let message = { message: 'El usuario o la contraseña introducidos no son correctos' };    
    
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, message);
      }
      if (!user.comparePassword(password)) {
        return done(null, false, message);
      }
      return done(null, user);
  });
}
));

passport.use(new GoogleStrategy({
    clientID: config.google_consumer_key,
    clientSecret: config.google_consumer_secret,
    callbackURL: config.google_callback,
    passReqToCallback   : true
  },
  function(req, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ 
        email: profile.email, 
        username:`${profile.given_name} ${profile.family_name}` 
    }, function (err, user) {
      return done(err, user);
    });
  }
));