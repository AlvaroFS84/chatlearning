

const express = require('express')
const app = express()
const { I18n } = require('i18n')
const path = require('path');
const i18n = new I18n()
const router = require('./routes/routes.js') 
const config = require('./config/config.js')
var morgan = require('morgan')

i18n.configure({
    locales: ['es', 'en'],
    directory: path.join(__dirname, '/locales'),
    defaultLocale: 'es',
    register: global
})

app.use(express.static(__dirname + '/public'));

app.use(morgan('combined'))

//para utilizar el i18n con twig
app.use(function(req, res, next) {
    // express helper for natively supported engines
    res.locals.__ = res.__ = function() {
        return i18n.__.apply(req, arguments);
    };
 
    next();
});
//rutas
app.use(router)


app.listen(config.port, () => {
    console.log(`ChatLearning app listening at http://localhost:${config.port}`)
})

