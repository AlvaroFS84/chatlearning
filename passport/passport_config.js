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
    var message = { message: 'El usuario o la contraseña introducidos no son correctos' };    
    
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, message);
      }
      if (!user.comparePassword(password)) {
        return done(null, false, message);
      }
      user.connected = true;
      user.save();
      return done(null, user);
  });
}
));

passport.use(new GoogleStrategy({
    clientID: config.google_consumer_key,
    clientSecret: config.google_consumer_secret,
    callbackURL: config.google_callback,
    passReqToCallback: true
  },
  async function(req, accessToken, refreshToken, profile, done) {
    await User.findOrCreate({ 
        email: profile.email, 
        username:`${profile.given_name} ${profile.family_name}` 
    },async function (err, user) {
      user.connected = true;
      user.google_user = true;
      await user.save();
      return done(err, user);
    });
  }
));