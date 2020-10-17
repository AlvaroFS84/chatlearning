

const express = require('express')
const app = express()
const { I18n } = require('i18n')
const path = require('path');
//const i18n = new I18n()
const router = require('./routes/routes.js') 
const config = require('./config/config.js')
var morgan = require('morgan')
const mongoose = require('mongoose');
const db = mongoose.connection;
const session = require('express-session')
const flash = require('express-flash');
const User = require('./models/user');
const passport = require('passport');
const bodyParser = require('body-parser')


/*i18n.configure({
    locales: ['es', 'en'],
    directory: path.join(__dirname, '/locales'),
    defaultLocale: 'es',
    register: global
})*/

app.use(session({
  secret: config.session_secret,
  resave: false,
  saveUninitialized: true
}))
app.use(express.static(__dirname + '/public'));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());

//rutas
app.use(router)

mongoose.connect( config.db_connect, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Database successfull connection!!');
    app.listen(config.port, () => {
        console.log(`ChatLearning app listening at http://localhost:${config.port}`)
    })
});




