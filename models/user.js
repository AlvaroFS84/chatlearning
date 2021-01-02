const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate')
const bcrypt = require('bcrypt');

/**
 * Constructor
 */
const userSchema = Schema({
    username: String,
    email: String,
    password: String,
    registrationDate: {type:Date, default: Date.now()},
    connected: { type:Boolean, default:false},
    google_user: { type:Boolean, deault: false}
});
/**
 * Encripta la contraseña pasada como parámetro
 * @param password 
 */
userSchema.methods.encryptPassword = function (password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}
/**
 * Compara la contraseña pasada por parametro con la del modelo
 * @param  password 
 */
userSchema.methods.comparePassword = function (password){
    return bcrypt.compareSync(password, this.password );
}

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User',userSchema)