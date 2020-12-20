const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate')
const bcrypt = require('bcrypt');

const userSchema = Schema({
    username: String,
    email: String,
    password: String,
    registrationDate: {type:Date, default: Date.now()},
    connected: { type:Boolean, default:false},
    google_user: { type:Boolean, deault: false}
});

userSchema.methods.encryptPassword = function (password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

userSchema.methods.comparePassword = function (password){
    return bcrypt.compareSync(password, this.password );
}

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User',userSchema)